from typing import Optional
from pydantic import BaseModel

# Shared properties
class CourseBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    credits: Optional[int] = 3
    code: Optional[str] = None

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

# Additional properties to return via API
class Course(CourseInDBBase):
    pass

# Additional properties stored in DB
class CourseInDB(CourseInDBBase):
    pass
