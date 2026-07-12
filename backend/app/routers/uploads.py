from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from typing import List
import os
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
    return {"url": await save_file(file, folder)}


@router.post("/images")
async def upload_images(
    files: List[UploadFile] = File(...),
    folder: str = Form("images"),
    current_user: User = Depends(require_admin),
):
    urls = []
    for f in files:
        urls.append(await save_file(f, folder))
    return {"urls": urls}


@router.post("/video")
async def upload_video(
    file: UploadFile = File(...),
    folder: str = Form("videos"),
    current_user: User = Depends(require_admin),
):
    return {"url": await save_file(file, folder)}


@router.delete("/delete")
def remove_file(
    url: str,
    current_user: User = Depends(require_admin),
):
    success = delete_file(url)
    return {"success": success}
