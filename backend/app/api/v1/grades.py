from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud.crud_grade import grade as crud_grade
from app.schemas.grade import Grade, GradeCreate, GradeUpdate

router = APIRouter()

@router.get("/", response_model=List[Grade])
async def read_grades(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    student_id: int = None,
    course_id: int = None
) -> Any:
    """
    Retrieve grades.
    """
    if student_id:
        return await crud_grade.get_by_student(db, student_id=student_id)
    if course_id:
        return await crud_grade.get_by_course(db, course_id=course_id)
    return await crud_grade.get_multi(db, skip=skip, limit=limit)

from app.utils.academic import is_barred_from_final

@router.post("/", response_model=Grade)
async def create_grade(
    *,
    db: AsyncSession = Depends(deps.get_db),
    grade_in: GradeCreate,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator", "Instructor"]))
) -> Any:
    """
    Create new grade with ICT University business rule enforcement.
    """
    # Fetch existing grades for this student and course to validate rules
    existing_grades = await crud_grade.get_by_student(db, student_id=grade_in.student_id)
    course_grades = [g for g in existing_grades if g.course_id == grade_in.course_id]
    
    # Rule 2.2: Barred from Final if no CA exists
    if grade_in.assessment_type == "Final" and not grade_in.is_resit:
        if is_barred_from_final(course_grades):
            raise HTTPException(
                status_code=403, 
                detail="Student is BARRED from Final Exam. No Continuous Assessment (CA) found."
            )
            
    # Rule 3.1: Resit Eligibility (Score < 50)
    if grade_in.is_resit:
        # Simplified check: just ensure there's a previous 'Final' attempt
        if not any(g.assessment_type == "Final" for g in course_grades):
            raise HTTPException(
                status_code=400,
                detail="Resit is only allowed after a failed Final Exam attempt."
            )

    grade = await crud_grade.create(db, obj_in=grade_in)
    return grade

@router.put("/{id}", response_model=Grade)
async def update_grade(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    grade_in: GradeUpdate,
) -> Any:
    """
    Update a grade.
    """
    grade = await crud_grade.get(db, id=id)
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    grade = await crud_grade.update(db, db_obj=grade, obj_in=grade_in)
    return grade

@router.delete("/{id}", response_model=Grade)
async def delete_grade(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Delete a grade.
    """
    grade = await crud_grade.get(db, id=id)
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    grade = await crud_grade.remove(db, id=id)
    return grade
