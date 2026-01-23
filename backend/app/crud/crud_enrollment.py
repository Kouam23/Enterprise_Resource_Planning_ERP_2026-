from app.crud.base import CRUDBase
from app.models.enrollment import Enrollment
from app.schemas.enrollment import EnrollmentCreate, EnrollmentUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

class CRUDEnrollment(CRUDBase[Enrollment, EnrollmentCreate, EnrollmentUpdate]):
    async def get_by_student(self, db: AsyncSession, *, student_id: int) -> List[Enrollment]:
        result = await db.execute(select(Enrollment).where(Enrollment.student_id == student_id))
        return result.scalars().all()

    async def get_by_course(self, db: AsyncSession, *, course_id: int) -> List[Enrollment]:
        result = await db.execute(select(Enrollment).where(Enrollment.course_id == course_id))
        return result.scalars().all()

enrollment = CRUDEnrollment(Enrollment)
