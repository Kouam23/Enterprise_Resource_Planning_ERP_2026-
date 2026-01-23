from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud.crud_student import student as crud_student
from app.crud.crud_course import course as crud_course
from app.schemas.student import Student, StudentCreate, StudentUpdate
from app.utils.academic import calculate_cgpa, calculate_course_total, get_classification, is_fee_cleared, check_max_stay
from app.crud.crud_tuition_invoice import tuition_invoice as crud_invoice
from sqlalchemy import select
from app.models.tuition_invoice import TuitionInvoice

router = APIRouter()

@router.get("/", response_model=List[Student])
async def read_students(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator", "Instructor", "Staff"]))
) -> Any:
    """
    Retrieve students with CGPA, Classification, and Fee Status enforcement.
    """
    students = await crud_student.get_multi(db, skip=skip, limit=limit)
    courses = await crud_course.get_multi(db)
    
    enriched_students = []
    for s in students:
        student_data = Student.model_validate(s)
        student_data.cumulative_gpa = calculate_cgpa(s.grades, courses)
        
        # Rule 1.1: Fee Clearance Verification
        # Fetch invoices for this student
        stmt = select(TuitionInvoice).where(TuitionInvoice.student_id == s.id)
        result = await db.execute(stmt)
        invoices = result.scalars().all()
        
        # If any invoice is uncleared (below 50%), flag status but only if they have invoices
        if invoices and not all(is_fee_cleared(inv) for inv in invoices):
            student_data.status = "overdue_payment" # Regional rule specific status
            
        # Rule 4.2: Max Stay Check (7 Years)
        if not check_max_stay(s.enrollment_date):
            student_data.status = "max_stay_exceeded"
            
        enriched_students.append(student_data)
        
    return enriched_students

@router.get("/{id}", response_model=Student)
async def read_student(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get student by ID with strict ICT rule validation.
    """
    student = await crud_student.get(db, id=id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Enrich with CGPA
    courses = await crud_course.get_multi(db)
    student_data = Student.model_validate(student)
    student_data.cumulative_gpa = calculate_cgpa(student.grades, courses)
    
    # Rule 1.1 & 4.2 enforcement for individual fetch
    stmt = select(TuitionInvoice).where(TuitionInvoice.student_id == student.id)
    result = await db.execute(stmt)
    invoices = result.scalars().all()
    
    if invoices and not all(is_fee_cleared(inv) for inv in invoices):
        student_data.status = "overdue_payment"
        
    if not check_max_stay(student.enrollment_date):
        student_data.status = "max_stay_exceeded"

    return student_data

@router.post("/", response_model=Student)
async def create_student(
    *,
    db: AsyncSession = Depends(deps.get_db),
    student_in: StudentCreate,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator", "Staff"]))
) -> Any:
    """
    Create new student with auto-generated Matricule. (Staff/Admin only)
    """
    student = await crud_student.get_by_email(db, email=student_in.email)
    if student:
        raise HTTPException(
            status_code=400,
            detail="The student with this email already exists in the system.",
        )
    student = await crud_student.create(db, obj_in=student_in)
    
    # Generate Matricule: ICTU + EnrollmentYear + PaddedID
    enrollment_year = student.enrollment_date.year if student.enrollment_date else 2024
    matricule = f"ICTU{enrollment_year}{student.id:03d}"
    
    # Update student with matricule
    student.matricule = matricule
    db.add(student)
    await db.commit()
    await db.refresh(student)
    
    return student

@router.put("/{id}", response_model=Student)
async def update_student(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    student_in: StudentUpdate,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator", "Staff"]))
) -> Any:
    """
    Update a student. (Staff/Admin only)
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
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator", "Instructor", "Staff"]))
) -> Any:
    """
    Generate a precise ICT University transcript using 30/70 split and 4.0 GPA scale.
    """
    student = await crud_student.get(db, id=id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    courses = await crud_course.get_multi(db)
    course_map = {c.id: c for c in courses}
    
    # Group grades by course
    course_grades = {}
    for g in student.grades:
        if g.course_id not in course_grades:
            course_grades[g.course_id] = []
        course_grades[g.course_id].append(g)
    
    transcript_entries = []
    for course_id, grades in course_grades.items():
        course = course_map.get(course_id)
        if not course: continue
        
        # Calculate CA Average
        ca_entries = [g.score for g in grades if g.assessment_type == "CA"]
        ca_score = sum(ca_entries) / len(ca_entries) if ca_entries else 0.0
        
        # Get Final (respecting Resit logic in calculate_course_total)
        final_score = next((g.score for g in grades if g.assessment_type == "Final"), 0.0)
        total_weighted = calculate_course_total(grades)
        
        transcript_entries.append({
            "course_code": course.code,
            "course_title": course.title,
            "credits": course.credits,
            "ca_score": round(ca_score, 1),
            "final_exam": round(final_score, 1),
            "total_weighted": round(total_weighted, 1),
            "term": grades[0].term if grades else "N/A"
        })
    
    cgpa = calculate_cgpa(student.grades, courses)
    classification = get_classification(cgpa)
    
    return {
        "student_name": student.full_name,
        "matricule": student.matricule,
        "cgpa": round(cgpa, 2),
        "classification": classification,
        "transcript": transcript_entries
    }

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
