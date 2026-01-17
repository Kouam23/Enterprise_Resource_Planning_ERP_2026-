
from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.api import deps
from app.models.course import Course
from app.models.student import Student
from app.models.transaction import Transaction
from app.models.employee import Employee

router = APIRouter()

@router.get("/stats")
async def get_stats(
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """
    Get system statistics for dashboard.
    """
    # Get total students
    student_count_res = await db.execute(select(func.count(Student.id)))
    student_count = student_count_res.scalar() or 0
    
    # Get total courses
    course_count_res = await db.execute(select(func.count(Course.id)))
    course_count = course_count_res.scalar() or 0
    
    # Get total employees
    employee_count_res = await db.execute(select(func.count(Employee.id)))
    employee_count = employee_count_res.scalar() or 0
    
    # Get financial balance
    income_res = await db.execute(select(func.sum(Transaction.amount)).where(Transaction.type == "income"))
    income = income_res.scalar() or 0
    expense_res = await db.execute(select(func.sum(Transaction.amount)).where(Transaction.type == "expense"))
    expense = expense_res.scalar() or 0
    balance = income - expense
    
    return {
        "total_students": student_count,
        "total_courses": course_count,
        "total_employees": employee_count,
        "balance": balance
    }
