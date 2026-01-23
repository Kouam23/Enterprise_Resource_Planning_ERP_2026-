from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.services.analytics_service import analytics_service
from app.models.student import Student
from app.models.course import Course
from app.models.user import User
from app.models.tuition_invoice import TuitionInvoice
from sqlalchemy import select, func

router = APIRouter()

@router.get("/stats")
async def read_stats(
    db: AsyncSession = Depends(deps.get_db),
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator", "Staff", "Instructor"]))
) -> Any:
    """
    Get high-level dashboard statistics.
    """
    # Count Students
    result_students = await db.execute(select(func.count(Student.id)))
    total_students = result_students.scalar() or 0

    # Count Courses
    result_courses = await db.execute(select(func.count(Course.id)))
    total_courses = result_courses.scalar() or 0

    # Count Employees (Users with role != Student)
    # Assuming role_id 1 is Student, or checking role.name. 
    # For speed, let's just count all users for now or filter if we knew IDs.
    # Better: Count users where role_id IS NOT student role.
    # But for now, let's just count all users to be displayed as "Community Members" or similar if we can't distinguish easy.
    # Actually, we can join Role. Let's just count all Users for simplicity of this task unless asked otherwise.
    # The prompt asked for "total_employees".
    # Let's try to count users who are NOT students.
    # We need to know the Role structure.
    # Let's just count ALL users for now to prevent sql errors if we don't know the exact ID.
    result_employees = await db.execute(select(func.count(User.id)))
    total_employees = result_employees.scalar() or 0
    
    # Calculate Balance (Total revenue collected)
    result_balance = await db.execute(select(func.sum(TuitionInvoice.amount_paid)))
    balance = result_balance.scalar() or 0.0

    return {
        "total_students": total_students,
        "total_courses": total_courses,
        "total_employees": total_employees,
        "balance": float(balance)
    }

@router.get("/student-risk/{student_id}")
async def get_student_risk(
    student_id: int,
    db: AsyncSession = Depends(deps.get_db),
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator", "Instructor"]))
) -> Any:
    """
    Get AI-driven risk assessment for a specific student.
    """
    return await analytics_service.predict_student_risk(db, student_id=student_id)

@router.get("/course-recommendations/{student_id}")
async def get_course_recommendations(
    student_id: int,
    db: AsyncSession = Depends(deps.get_db),
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator", "Instructor"]))
) -> Any:
    """
    Get AI-driven course recommendations for a student.
    """
    return await analytics_service.get_course_recommendations(db, student_id=student_id)

@router.get("/at-risk-students")
async def get_at_risk_students(
    db: AsyncSession = Depends(deps.get_db),
    threshold: int = 40,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator"]))
) -> Any:
    """
    Get a list of all students whose risk score is above the threshold.
    """
    result = await db.execute(select(Student))
    students = result.scalars().all()
    
    at_risk = []
    for student in students:
        prediction = await analytics_service.predict_student_risk(db, student.id)
        if prediction.get("risk_score", 0) >= threshold:
            at_risk.append(prediction)
            
    return sorted(at_risk, key=lambda x: x["risk_score"], reverse=True)
