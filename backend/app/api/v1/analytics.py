from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.services.analytics_service import analytics_service
from app.models.student import Student
from sqlalchemy.future import select

router = APIRouter()

@router.get("/student-risk/{student_id}")
async def get_student_risk(
    student_id: int,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """
    Get AI-driven risk assessment for a specific student.
    """
    return await analytics_service.predict_student_risk(db, student_id=student_id)

@router.get("/course-recommendations/{student_id}")
async def get_course_recommendations(
    student_id: int,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """
    Get AI-driven course recommendations for a student.
    """
    return await analytics_service.get_course_recommendations(db, student_id=student_id)

@router.get("/at-risk-students")
async def get_at_risk_students(
    db: AsyncSession = Depends(deps.get_db),
    threshold: int = 40
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
