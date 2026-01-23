from typing import Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select
from app.crud.base import CRUDBase
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate

class CRUDStudent(CRUDBase[Student, StudentCreate, StudentUpdate]):
    async def get(self, db: AsyncSession, id: Any) -> Optional[Student]:
        result = await db.execute(
            select(Student)
            .where(Student.id == id)
            .options(selectinload(Student.grades))
        )
        return result.scalars().first()

    async def get_multi(
        self, db: AsyncSession, skip: int = 0, limit: int = 100
    ) -> List[Student]:
        result = await db.execute(
            select(Student)
            .offset(skip)
            .limit(limit)
            .options(selectinload(Student.grades))
        )
        return result.scalars().all()

    async def get_by_email(self, db: AsyncSession, *, email: str) -> Optional[Student]:
        result = await db.execute(
            select(Student).where(Student.email == email)
        )
        return result.scalars().first()

student = CRUDStudent(Student)
