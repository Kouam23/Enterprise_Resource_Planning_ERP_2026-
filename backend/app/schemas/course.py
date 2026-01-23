from typing import Optional, List
from pydantic import BaseModel

# Shared properties
class CourseBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    credits: Optional[int] = 3
    code: Optional[str] = None
    is_mandatory: Optional[bool] = True
    category: Optional[str] = "core"
    capacity: Optional[int] = 30
    hours_per_week: Optional[int] = 3
    prerequisite_ids: Optional[List[int]] = []
    corequisite_ids: Optional[List[int]] = []

# Properties to receive via API on creation
class CourseCreate(CourseBase):
    title: str
    code: str

# Properties to receive via API on update
class CourseUpdate(CourseBase):
    pass

class CourseInDBBase(CourseBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True

# Simplified schema for list responses (no relationships)
class CourseList(CourseInDBBase):
    """Course schema for list endpoints - excludes relationships to avoid lazy loading"""
    pass

# Additional properties to return via API
class Course(CourseInDBBase):
    prerequisites: Optional[List["Course"]] = None
    co_requisites: Optional[List["Course"]] = None

# Additional properties stored in DB
class CourseInDB(CourseInDBBase):
    pass
