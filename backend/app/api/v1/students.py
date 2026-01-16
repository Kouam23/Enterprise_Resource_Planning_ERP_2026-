from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud.crud_student import student as crud_student
from app.schemas.student import Student, StudentCreate, StudentUpdate

router = APIRouter()

@router.get("/", response_model=List[Student])
async def read_students(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve students.
    """
    students = await crud_student.get_multi(db, skip=skip, limit=limit)
    return students

@router.post("/", response_model=Student)
async def create_student(
    *,
    db: AsyncSession = Depends(deps.get_db),
    student_in: StudentCreate,
) -> Any:
    """
    Create new student.
    """
    student = await crud_student.create(db, obj_in=student_in)
    return student

@router.put("/{id}", response_model=Student)
async def update_student(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    student_in: StudentUpdate,
) -> Any:
    """
    Update a student.
    """
    student = await crud_student.get(db, id=id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student = await crud_student.update(db, db_obj=student, obj_in=student_in)
    return student

@router.get("/{id}", response_model=Student)
async def read_student(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get student by ID.
    """
    student = await crud_student.get(db, id=id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.delete("/{id}", response_model=Student)
async def delete_student(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Delete a student.
    """
    student = await crud_student.get(db, id=id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student = await crud_student.remove(db, id=id)
    return student
