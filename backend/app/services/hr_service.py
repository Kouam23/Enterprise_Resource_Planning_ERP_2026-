from typing import List, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.employee import Employee
from app.models.payroll import Payroll
from app.crud.crud_hr_ext import payroll as crud_payroll
from datetime import datetime

class HRService:
    @staticmethod
    async def generate_monthly_payroll(db: AsyncSession, month: int, year: int):
        result = await db.execute(select(Employee).where(Employee.status == "active"))
        employees = result.scalars().all()
        
        count = 0
        for emp in employees:
            # Check if payroll already exists
            existing = await db.execute(select(Payroll).where(
                Payroll.employee_id == emp.id,
                Payroll.month == month,
                Payroll.year == year
            ))
            if existing.scalars().first():
                continue
                
            # Basic calculation: 10% tax (placeholder)
            base_salary = emp.salary or 0.0
            tax = base_salary * 0.10
            net_pay = base_salary - tax
            
            p_in = {
                "employee_id": emp.id,
                "month": month,
                "year": year,
                "base_salary": base_salary,
                "tax": tax,
                "net_pay": net_pay,
                "status": "pending"
            }
            db.add(Payroll(**p_in))
            count += 1
            
        await db.commit()
        return {"message": f"Generated payroll for {count} employees"}

    @staticmethod
    async def approve_payroll(db: AsyncSession, payroll_id: int):
        p = await crud_payroll.get(db, id=payroll_id)
        if not p:
            return {"error": "Payroll record not found"}
        p.status = "approved"
        await db.commit()
        return p

hr_service = HRService()
