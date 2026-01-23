from typing import Optional
from datetime import datetime
from pydantic import BaseModel

# Shared properties
class GradeBase(BaseModel):
    assessment_type: Optional[str] = None
    score: Optional[float] = None
    weight: Optional[float] = 1.0
    term: Optional[str] = None
    is_resit: Optional[bool] = False

# Properties to receive via API on creation
class GradeCreate(GradeBase):
    student_id: int
    course_id: int
    assessment_type: str
    score: float

# Properties to receive via API on update
class GradeUpdate(GradeBase):
    pass

class GradeInDBBase(GradeBase):
    id: Optional[int] = None
    student_id: int
    course_id: int
    date: datetime

    class Config:
        from_attributes = True

# Additional properties to return via API
class Grade(GradeInDBBase):
    pass
