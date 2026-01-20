from typing import Optional
from pydantic import BaseModel

class ScholarshipBase(BaseModel):
    student_id: Optional[int] = None
    amount: Optional[float] = None
    scholarship_type: Optional[str] = None
    description: Optional[str] = None

class ScholarshipCreate(ScholarshipBase):
    student_id: int
    amount: float

class ScholarshipUpdate(ScholarshipBase):
    pass

class ScholarshipInDBBase(ScholarshipBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True

class Scholarship(ScholarshipInDBBase):
    pass
