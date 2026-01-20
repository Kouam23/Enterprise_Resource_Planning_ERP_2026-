from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.crud.base import CRUDBase
from app.models.grade import Grade
from app.schemas.grade import GradeCreate, GradeUpdate

class CRUDGrade(CRUDBase[Grade, GradeCreate, GradeUpdate]):
    async def get_by_student(self, db: AsyncSession, *, student_id: int) -> List[Grade]:
        result = await db.execute(select(Grade).filter(Grade.student_id == student_id))
        return result.scalars().all()

    async def get_by_course(self, db: AsyncSession, *, course_id: int) -> List[Grade]:
        result = await db.execute(select(Grade).filter(Grade.course_id == course_id))
        return result.scalars().all()

grade = CRUDGrade(Grade)
