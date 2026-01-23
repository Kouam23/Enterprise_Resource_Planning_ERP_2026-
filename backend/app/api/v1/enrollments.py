from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.api import deps
from app.crud.crud_enrollment import enrollment as crud_enrollment
from app.crud.crud_student import student as crud_student
from app.crud.crud_course import course as crud_course
from app.schemas.enrollment import Enrollment, EnrollmentCreate, EnrollmentUpdate
from app.utils.academic import (
    calculate_cgpa, 
    check_max_credits, 
    has_cleared_prerequisites, 
    is_fee_cleared, 
    check_max_stay
)
from app.models.tuition_invoice import TuitionInvoice

router = APIRouter()

@router.post("/", response_model=Enrollment)
async def enroll_student(
    *,
    db: AsyncSession = Depends(deps.get_db),
    enroll_in: EnrollmentCreate,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator", "Staff"]))
) -> Any:
    """
    Enroll a student in a course with strict ICT University rule enforcement.
    """
    # 1. Fetch Student and Course
    student = await crud_student.get(db, id=enroll_in.student_id)
    course = await crud_course.get(db, id=enroll_in.course_id)
    if not student or not course:
        raise HTTPException(status_code=404, detail="Student or Course not found")
        
    # 2. Rule 1.1: Fee Clearance (50% rule)
    stmt = select(TuitionInvoice).where(TuitionInvoice.student_id == student.id)
    result = await db.execute(stmt)
    invoices = result.scalars().all()
    if invoices and not all(is_fee_cleared(inv) for inv in invoices):
        raise HTTPException(
            status_code=403, 
            detail="Registration Blocked: 50% Fee Clearance required for this semester."
        )

    # 3. Rule 4.2: Maximum Stay (7 Years)
    if not check_max_stay(student.enrollment_date):
        raise HTTPException(status_code=403, detail="Registration Blocked: Maximum stay of 7 years exceeded.")

    # 4. Rule 1.2: Prerequisite Enforcement
    if not has_cleared_prerequisites(student.grades, course):
        raise HTTPException(
            status_code=400, 
            detail=f"Prerequisites not met for {course.code}. Please complete required courses first."
        )

    # 5. Rule 5.2 & 2.1: Credit Limits (30 Standard / 20 Probation)
    courses_db = await crud_course.get_multi(db)
    cgpa = calculate_cgpa(student.grades, courses_db)
    max_credits = check_max_credits(cgpa)
    
    # Calculate current credits in this term (including the requested course)
    current_enrollments = await crud_enrollment.get_by_student(db, student_id=student.id)
    term_enrollments = [e for e in current_enrollments if e.term == enroll_in.term and e.status == "enrolled"]
    
    # Sum credits from courses
    term_course_ids = [e.course_id for e in term_enrollments]
    current_term_courses = [c for c in courses_db if c.id in term_course_ids]
    current_term_credits = sum(c.credits for c in current_term_courses)
    
    if (current_term_credits + course.credits) > max_credits:
        limit_reason = "Probation (CGPA < 2.0)" if cgpa < 2.0 else "Standard Semester"
        raise HTTPException(
            status_code=400, 
            detail=f"Registration Blocked: Credit limit of {max_credits} reached for {limit_reason}."
        )

    # 6. Check if already enrolled
    if any(e.course_id == course.id for e in term_enrollments):
        raise HTTPException(status_code=400, detail="Student is already enrolled in this course for this term.")

    # 7. Create Enrollment
    return await crud_enrollment.create(db, obj_in=enroll_in)

@router.get("/student/{student_id}", response_model=List[Enrollment])
async def read_student_enrollments(
    *,
    db: AsyncSession = Depends(deps.get_db),
    student_id: int,
) -> Any:
    return await crud_enrollment.get_by_student(db, student_id=student_id)
