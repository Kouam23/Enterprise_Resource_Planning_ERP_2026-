from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud.crud_course import course as crud_course
from app.schemas.course import Course, CourseCreate, CourseUpdate, CourseList

router = APIRouter()

@router.get("/", response_model=List[CourseList])
async def read_courses(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve courses.
    """
    courses = await crud_course.get_multi(db, skip=skip, limit=limit)
    return courses

@router.post("/", response_model=Course)
async def create_course(
    *,
    db: AsyncSession = Depends(deps.get_db),
    course_in: CourseCreate,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator"]))
) -> Any:
    """
    Create new course.
    """
    course = await crud_course.create(db, obj_in=course_in)
    return course

@router.put("/{id}", response_model=Course)
async def update_course(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    course_in: CourseUpdate,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator"]))
) -> Any:
    """
    Update a course.
    """
    course = await crud_course.get(db, id=id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    course = await crud_course.update(db, db_obj=course, obj_in=course_in)
    return course

@router.get("/{id}", response_model=Course)
async def read_course(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get course by ID.
    """
    course = await crud_course.get(db, id=id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.delete("/{id}", response_model=Course)
async def delete_course(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator"]))
) -> Any:
    """
    Delete a course.
    """
    course = await crud_course.get(db, id=id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    course = await crud_course.remove(db, id=id)
    return course
