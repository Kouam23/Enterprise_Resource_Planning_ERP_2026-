from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class EnrollmentBase(BaseModel):
    student_id: int
    course_id: int
    term: str
    status: Optional[str] = "enrolled"

class EnrollmentCreate(EnrollmentBase):
    pass

class EnrollmentUpdate(BaseModel):
    status: Optional[str] = None

class Enrollment(EnrollmentBase):
    id: int
    enrollment_date: datetime

    class Config:
        from_attributes = True
