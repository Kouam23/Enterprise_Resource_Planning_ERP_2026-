from typing import Any, Dict, Optional, Union, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.crud.base import CRUDBase
from app.models.course import Course
from app.schemas.course import CourseCreate, CourseUpdate

class CRUDCourse(CRUDBase[Course, CourseCreate, CourseUpdate]):
    async def create(self, db: AsyncSession, *, obj_in: CourseCreate) -> Course:
        db_obj = Course(
            title=obj_in.title,
            description=obj_in.description,
            credits=obj_in.credits,
            code=obj_in.code,
            is_mandatory=obj_in.is_mandatory,
            category=obj_in.category,
            capacity=obj_in.capacity,
            hours_per_week=obj_in.hours_per_week,
        )
        if obj_in.prerequisite_ids:
            result = await db.execute(select(Course).filter(Course.id.in_(obj_in.prerequisite_ids)))
            db_obj.prerequisites = result.scalars().all()
        if obj_in.corequisite_ids:
            result = await db.execute(select(Course).filter(Course.id.in_(obj_in.corequisite_ids)))
            db_obj.co_requisites = result.scalars().all()
        
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(
        self, db: AsyncSession, *, db_obj: Course, obj_in: Union[CourseUpdate, Dict[str, Any]]
    ) -> Course:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        
        if "prerequisite_ids" in update_data:
            ids = update_data.pop("prerequisite_ids")
            if ids is not None:
                result = await db.execute(select(Course).filter(Course.id.in_(ids)))
                db_obj.prerequisites = result.scalars().all()
        
        if "corequisite_ids" in update_data:
            ids = update_data.pop("corequisite_ids")
            if ids is not None:
                result = await db.execute(select(Course).filter(Course.id.in_(ids)))
                db_obj.co_requisites = result.scalars().all()

        return await super().update(db, db_obj=db_obj, obj_in=update_data)

course = CRUDCourse(Course)
