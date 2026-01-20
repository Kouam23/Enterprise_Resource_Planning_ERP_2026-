from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud.crud_student import student as crud_student
from app.crud.crud_course import course as crud_course
from app.schemas.student import Student, StudentCreate, StudentUpdate
from app.utils.academic import calculate_cgpa

router = APIRouter()

@router.get("/", response_model=List[Student])
async def read_students(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve students with CGPA.
    """
    students = await crud_student.get_multi(db, skip=skip, limit=limit)
    courses = await crud_course.get_multi(db)
    
    # Enrich students with CGPA
    enriched_students = []
    for s in students:
        # Pydantic v2 requires manually adding attributes not in DB if not defined as computed
        student_data = Student.model_validate(s)
        student_data.cgpa = calculate_cgpa(s.grades, courses)
        enriched_students.append(student_data)
        
    return enriched_students

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

@router.get("/{id}/transcript")
async def get_student_transcript(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Generate a simple transcript for a student.
    """
    student = await crud_student.get(db, id=id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    courses = await crud_course.get_multi(db)
    course_map = {c.id: c for c in courses}
    
    transcript_entries = []
    for g in student.grades:
        course = course_map.get(g.course_id)
        transcript_entries.append({
            "course_code": course.code if course else "Unknown",
            "course_title": course.title if course else "Unknown",
            "credits": course.credits if course else 0,
            "assessment": g.assessment_type,
            "score": g.score,
            "weight": g.weight,
            "term": g.term,
            "date": g.date
        })
    
    cgpa = calculate_cgpa(student.grades, courses)
    
    return {
        "student_name": student.full_name,
        "email": student.email,
        "cgpa": round(cgpa, 2),
        "transcript": transcript_entries
    }

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
