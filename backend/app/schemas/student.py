from typing import Optional
from datetime import date
from pydantic import BaseModel, EmailStr

# Shared properties
class StudentBase(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    enrollment_date: Optional[date] = None
    status: Optional[str] = "active"
    program_id: Optional[int] = None

# Properties to receive via API on creation
class StudentCreate(StudentBase):
    full_name: str
    email: EmailStr

# Properties to receive via API on update
class StudentUpdate(StudentBase):
    pass

class StudentInDBBase(StudentBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True

# Additional properties to return via API
class Student(StudentInDBBase):
    cgpa: Optional[float] = 0.0

# Additional properties stored in DB
class StudentInDB(StudentInDBBase):
    pass
