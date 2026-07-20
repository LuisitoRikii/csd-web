import io
import os
import uuid
from typing import Optional
from urllib.parse import unquote, urlparse
from fastapi import UploadFile, HTTPException
from PIL import Image, ImageOps
from app.core.config import settings


IMAGE_EXTENSIONS = {
    "image/jpeg": {"jpg", "jpeg"},
    "image/jpg": {"jpg", "jpeg"},
    "image/png": {"png"},
    "image/webp": {"webp"},
}
VIDEO_EXTENSIONS = {
    "video/mp4": {"mp4"},
    "video/webm": {"webm"},
    "video/quicktime": {"mov"},
}


def _upload_folder(folder: str) -> str:
    normalized = os.path.normpath((folder or "").strip("/\\"))
    if normalized in {"", ".", ".."}:
        raise HTTPException(status_code=400, detail="Invalid upload folder")

    root = os.path.realpath(settings.UPLOAD_DIR)
    target = os.path.realpath(os.path.join(root, normalized))
    if not target.startswith(root + os.sep):
        raise HTTPException(status_code=400, detail="Invalid upload folder")
    return target


def validate_media_content(content: bytes, content_type: str, extension: str) -> None:
    extensions = IMAGE_EXTENSIONS.get(content_type) or VIDEO_EXTENSIONS.get(content_type)
    if extensions and extension not in extensions:
        raise HTTPException(status_code=415, detail="File extension does not match its type")

    if content_type in IMAGE_EXTENSIONS:
        try:
            image = Image.open(io.BytesIO(content))
            if image.width * image.height > 40_000_000:
                raise ValueError("Image dimensions too large")
            image.verify()
        except Exception as exc:
            raise HTTPException(status_code=415, detail="Invalid image file") from exc

    if content_type in {"video/mp4", "video/quicktime"} and b"ftyp" not in content[:64]:
        raise HTTPException(status_code=415, detail="Invalid video file")
    if content_type == "video/webm" and not content.startswith(b"\x1aE\xdf\xa3"):
        raise HTTPException(status_code=415, detail="Invalid video file")


async def save_file(file: UploadFile, folder: str = "images", allowed_types: Optional[list[str]] = None) -> str:
    content_type = (file.content_type or "").split(";", 1)[0].lower()
    if allowed_types and content_type not in allowed_types:
        raise HTTPException(status_code=415, detail="File type not allowed")

    filename = file.filename or ""
    if "." not in filename:
        raise HTTPException(status_code=415, detail="File extension required")
    file_extension = filename.rsplit(".", 1)[-1].lower()

    content = await file.read(settings.MAX_UPLOAD_SIZE + 1)
    if len(content) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=413, detail="File too large")
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")

    validate_media_content(content, content_type, file_extension)
    file_path = _upload_folder(folder)
    os.makedirs(file_path, exist_ok=True)

    unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
    full_path = os.path.join(file_path, unique_filename)
    with open(full_path, "wb") as output:
        output.write(content)

    if content_type in IMAGE_EXTENSIONS:
        try:
            image = ImageOps.exif_transpose(Image.open(full_path))
            max_size = (2400, 2400)
            if image.size[0] > max_size[0] or image.size[1] > max_size[1]:
                image.thumbnail(max_size, Image.Resampling.LANCZOS)
                image.save(full_path, optimize=True, quality=85)
        except Exception:
            os.remove(full_path)
            raise HTTPException(status_code=415, detail="Invalid image file")

    relative_folder = os.path.relpath(file_path, os.path.realpath(settings.UPLOAD_DIR)).replace(os.sep, "/")
    return f"/uploads/{relative_folder}/{unique_filename}"


def delete_file(file_url: Optional[str]) -> bool:
    if not file_url:
        return False

    try:
        path = unquote(urlparse(file_url).path)
        if not path.startswith("/uploads/"):
            return False
        relative_path = path.removeprefix("/uploads/")
        root = os.path.realpath(settings.UPLOAD_DIR)
        file_path = os.path.realpath(os.path.join(root, relative_path))
        if not file_path.startswith(root + os.sep) or not os.path.isfile(file_path):
            return False
        os.remove(file_path)
        return True
    except OSError:
        return False
