import os
import uuid
from typing import Optional
from fastapi import UploadFile, HTTPException
from PIL import Image
from app.core.config import settings


async def save_file(file: UploadFile, folder: str = "images") -> str:
    if not os.path.exists(settings.UPLOAD_DIR):
        os.makedirs(settings.UPLOAD_DIR)

    file_path = os.path.join(settings.UPLOAD_DIR, folder)
    if not os.path.exists(file_path):
        os.makedirs(file_path)

    file_extension = file.filename.split(".")[-1].lower() if "." in file.filename else "jpg"
    unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
    full_path = os.path.join(file_path, unique_filename)

    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=413, detail="File too large")

    with open(full_path, "wb") as f:
        f.write(content)

    if folder == "images" and file_extension in ["jpg", "jpeg", "png", "webp"]:
        try:
            image = Image.open(full_path)
            max_size = (2400, 2400)
            if image.size[0] > max_size[0] or image.size[1] > max_size[1]:
                image.thumbnail(max_size, Image.Resampling.LANCZOS)
                image.save(full_path, optimize=True, quality=85)
        except Exception:
            pass

    return f"/uploads/{folder}/{unique_filename}"


def delete_file(file_url: Optional[str]) -> bool:
    if not file_url:
        return False
    try:
        file_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            file_url.lstrip("/")
        )
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
    except Exception:
        return False
    return False
