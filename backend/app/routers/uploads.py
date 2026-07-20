from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from typing import List
from app.core.config import settings
from app.middlewares.deps import require_admin
from app.models.user import User
from app.utils.files import save_file, delete_file

router = APIRouter(prefix="/upload", tags=["Uploads"])


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    folder: str = Form("images"),
    current_user: User = Depends(require_admin),
):
    return {"url": await save_file(file, folder, settings.ALLOWED_IMAGE_TYPES)}


@router.post("/images")
async def upload_images(
    files: List[UploadFile] = File(...),
    folder: str = Form("images"),
    current_user: User = Depends(require_admin),
):
    if len(files) > 20:
        raise HTTPException(status_code=400, detail="A maximum of 20 images is allowed")
    total_size = sum(file.size or 0 for file in files)
    if total_size > settings.MAX_BATCH_UPLOAD_SIZE:
        raise HTTPException(status_code=413, detail="Image batch is too large")

    urls = []
    try:
        for file in files:
            urls.append(await save_file(file, folder, settings.ALLOWED_IMAGE_TYPES))
    except Exception:
        for url in urls:
            delete_file(url)
        raise
    return {"urls": urls}


@router.post("/video")
async def upload_video(
    file: UploadFile = File(...),
    folder: str = Form("videos"),
    current_user: User = Depends(require_admin),
):
    return {"url": await save_file(file, folder, settings.ALLOWED_VIDEO_TYPES)}


@router.delete("/delete")
def remove_file(
    url: str,
    current_user: User = Depends(require_admin),
):
    success = delete_file(url)
    return {"success": success}
