import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.api import deps
from app.core.config import settings

router = APIRouter()

# Just a simple storage for now
UPLOAD_DIR = "uploads/syllabi"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-syllabus/{course_id}")
async def upload_syllabus(
    course_id: int,
    file: UploadFile = File(...)
):
    """
    Upload a course syllabus.
    """
    file_path = os.path.join(UPLOAD_DIR, f"{course_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    
    return {"filename": file.filename, "course_id": course_id, "status": "uploaded"}

@router.get("/download-syllabus/{course_id}")
async def download_syllabus(course_id: int):
    # This would normally search for the file in the dir
    # Simplified for the ERP model
    return {"message": "Syllabus download endpoint pending file mapping implementation"}
