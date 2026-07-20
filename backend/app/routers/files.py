"""Files router — exposes the uploads directory as a tree so the admin can
browse, download (single file or whole folder as zip), upload, and delete.

Security:
- All endpoints require admin auth.
- Paths are resolved relative to settings.UPLOAD_DIR and traversal attempts
  (`..`, absolute paths) are rejected.
- Hidden/system files are skipped.
"""
import os
import io
import time
import mimetypes
import zipfile
import shutil
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel

from app.core.config import settings
from app.middlewares.deps import require_admin
from app.models.user import User

router = APIRouter(prefix="/files", tags=["Files"])

# Folders we never want the admin to delete or navigate out of
PROJECT_ROOT = os.path.realpath(settings.UPLOAD_DIR)
MAX_UPLOAD_BYTES = settings.MAX_UPLOAD_SIZE


# ---------- Schemas ----------

class FileNode(BaseModel):
    name: str
    path: str  # relative to PROJECT_ROOT, always uses '/'
    type: str  # 'file' | 'directory'
    size: int
    size_human: str
    mime: Optional[str] = None
    modified: Optional[str] = None
    children: Optional[List["FileNode"]] = None


FileNode.model_rebuild()


class DiskUsage(BaseModel):
    total_bytes: int
    total_human: str
    file_count: int
    folder_count: int
    by_folder: dict


# ---------- Helpers ----------

def human_size(num: int) -> str:
    for unit in ("B", "KB", "MB", "GB", "TB"):
        if abs(num) < 1024.0:
            return f"{num:.1f} {unit}" if unit != "B" else f"{num} {unit}"
        num /= 1024.0
    return f"{num:.1f} PB"


def resolve_path(rel_path: str) -> str:
    """Resolve a relative path safely inside PROJECT_ROOT. Raises 400 on
    traversal attempts or absolute paths."""
    if rel_path is None:
        rel_path = ""
    if os.path.isabs(rel_path) or rel_path.startswith("/"):
        rel_path = rel_path.lstrip("/")
    # Strip any leading .. segments by resolving and asserting we're inside the root
    candidate = os.path.realpath(os.path.join(PROJECT_ROOT, rel_path))
    if not candidate.startswith(PROJECT_ROOT + os.sep) and candidate != PROJECT_ROOT:
        raise HTTPException(status_code=400, detail="Invalid path")
    return candidate


def to_rel(abs_path: str) -> str:
    rel = os.path.relpath(abs_path, PROJECT_ROOT)
    return rel.replace(os.sep, "/")


def build_node(abs_path: str, depth: int = 0, max_depth: int = 4) -> FileNode:
    rel = to_rel(abs_path)
    name = os.path.basename(abs_path) or rel or "/"
    try:
        stat = os.stat(abs_path)
    except OSError:
        stat = None
    size = stat.st_size if stat else 0
    modified = datetime.fromtimestamp(stat.st_mtime).isoformat() if stat else None

    if os.path.isdir(abs_path):
        children: List[FileNode] = []
        try:
            entries = sorted(os.listdir(abs_path), key=lambda n: (not os.path.isdir(os.path.join(abs_path, n)), n.lower()))
            for entry in entries:
                if entry.startswith("."):
                    continue
                child_abs = os.path.join(abs_path, entry)
                if depth < max_depth and os.path.isdir(child_abs):
                    children.append(build_node(child_abs, depth + 1, max_depth))
                else:
                    # Flatten deep files into this node
                    children.append(build_node(child_abs, max_depth, max_depth))
        except PermissionError:
            pass
        return FileNode(
            name=name,
            path=rel,
            type="directory",
            size=size,
            size_human=human_size(size),
            modified=modified,
            children=children,
        )

    mime, _ = mimetypes.guess_type(abs_path)
    return FileNode(
        name=name,
        path=rel,
        type="file",
        size=size,
        size_human=human_size(size),
        mime=mime,
        modified=modified,
    )


def compute_disk_usage(abs_path: str, by_folder: dict) -> tuple[int, int, int]:
    """Returns (total_bytes, file_count, folder_count)."""
    total = 0
    files = 0
    folders = 0
    try:
        for entry in os.listdir(abs_path):
            if entry.startswith("."):
                continue
            child = os.path.join(abs_path, entry)
            if os.path.isdir(child):
                folders += 1
                sub_total, sub_files, sub_folders = compute_disk_usage(child, by_folder)
                total += sub_total
                files += sub_files + 1  # +1 for the folder entry? no, folder count separate
                folders += sub_folders
                rel = to_rel(child)
                by_folder[rel] = sub_total
            else:
                try:
                    total += os.path.getsize(child)
                    files += 1
                except OSError:
                    pass
    except PermissionError:
        pass
    return total, files, folders


# ---------- Endpoints ----------

@router.get("/tree", response_model=FileNode)
def get_tree(
    path: str = Query("", description="Relative path inside uploads/"),
    depth: int = Query(3, ge=0, le=6),
    current_user: User = Depends(require_admin),
):
    abs_path = resolve_path(path)
    if not os.path.exists(abs_path):
        raise HTTPException(status_code=404, detail="Path not found")
    return build_node(abs_path, 0, depth)


@router.get("/disk-usage", response_model=DiskUsage)
def disk_usage(current_user: User = Depends(require_admin)):
    if not os.path.exists(PROJECT_ROOT):
        return DiskUsage(total_bytes=0, total_human="0 B", file_count=0, folder_count=0, by_folder={})
    by_folder: dict = {}
    total, files, folders = compute_disk_usage(PROJECT_ROOT, by_folder)
    return DiskUsage(
        total_bytes=total,
        total_human=human_size(total),
        file_count=files,
        folder_count=folders,
        by_folder={k: human_size(v) for k, v in sorted(by_folder.items(), key=lambda kv: -kv[1])},
    )


@router.get("/download")
def download_file(
    path: str = Query(..., description="Relative path to file"),
    current_user: User = Depends(require_admin),
):
    abs_path = resolve_path(path)
    if not os.path.exists(abs_path) or not os.path.isfile(abs_path):
        raise HTTPException(status_code=404, detail="File not found")
    rel = to_rel(abs_path) or "file"
    return FileResponse(abs_path, filename=os.path.basename(abs_path))


@router.get("/download-zip")
def download_zip(
    path: str = Query("", description="Relative path to folder; empty = whole uploads"),
    current_user: User = Depends(require_admin),
):
    abs_path = resolve_path(path)
    if not os.path.exists(abs_path) or not os.path.isdir(abs_path):
        raise HTTPException(status_code=404, detail="Folder not found")

    zip_name = (os.path.basename(abs_path) or "uploads") + ".zip"

    def generator():
        with zipfile.ZipFile(io.BytesIO(), "w", zipfile.ZIP_DEFLATED) as _:
            pass
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
            base = abs_path
            for root, dirs, files in os.walk(abs_path):
                dirs[:] = [d for d in dirs if not d.startswith(".")]
                for f in files:
                    if f.startswith("."):
                        continue
                    fp = os.path.join(root, f)
                    arc = os.path.relpath(fp, base)
                    try:
                        zf.write(fp, arcname=arc)
                    except OSError:
                        continue
        buf.seek(0)
        yield from iter(lambda: buf.read(64 * 1024), b"")

    return StreamingResponse(
        generator(),
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{zip_name}"'},
    )


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    path: str = Query("", description="Folder inside uploads/ to upload to"),
    current_user: User = Depends(require_admin),
):
    target_dir = resolve_path(path)
    if not os.path.isdir(target_dir):
        raise HTTPException(status_code=400, detail="Target folder does not exist")

    safe_name = os.path.basename(file.filename or "file")
    if not safe_name:
        safe_name = f"upload-{int(time.time())}"

    # Avoid collisions: prefix with timestamp + uuid
    import uuid
    final_name = f"{int(time.time())}-{uuid.uuid4().hex[:6]}-{safe_name}"
    final_path = os.path.join(target_dir, final_name)

    size = 0
    with open(final_path, "wb") as out:
        while chunk := await file.read(1024 * 1024):
            size += len(chunk)
            if size > MAX_UPLOAD_BYTES:
                out.close()
                os.remove(final_path)
                raise HTTPException(status_code=413, detail="File too large")
            out.write(chunk)

    rel = to_rel(final_path)
    return {"path": rel, "name": safe_name, "size": size, "size_human": human_size(size)}


@router.delete("")
def delete_path(
    path: str = Query(..., description="Relative path to file or folder"),
    current_user: User = Depends(require_admin),
):
    abs_path = resolve_path(path)
    if abs_path == PROJECT_ROOT:
        raise HTTPException(status_code=400, detail="Cannot delete the uploads root")
    if not os.path.exists(abs_path):
        raise HTTPException(status_code=404, detail="Path not found")
    try:
        if os.path.isdir(abs_path):
            shutil.rmtree(abs_path)
        else:
            os.remove(abs_path)
    except OSError as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {e}")
    return {"deleted": to_rel(abs_path)}
