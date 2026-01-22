import os
import shutil
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.api import deps
from app.core.config import settings

router = APIRouter()

# Ensure uploads directory exists
UPLOAD_DIR = "uploads/profile_pics"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload/profile-pic")
async def upload_profile_pic(
    file: UploadFile = File(...),
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Upload a profile picture for the current user.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"user_{current_user.id}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # In a real app, this might be a full URL to a CDN or a relative path
    # For this simulation, we'll return a relative path or a mock URL
    # We'll use a relative path that the frontend can resolve
    relative_path = f"/uploads/profile_pics/{file_name}"
    
    return {"url": relative_path}
