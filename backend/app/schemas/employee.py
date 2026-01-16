from typing import Optional
from datetime import date
from pydantic import BaseModel, EmailStr

# Shared properties
class EmployeeBase(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    position: Optional[str] = None
    department: Optional[str] = None
    salary: Optional[float] = None
    hire_date: Optional[date] = None
    status: Optional[str] = "active"

# Properties to receive via API on creation
class EmployeeCreate(EmployeeBase):
    full_name: str
    email: EmailStr

# Properties to receive via API on update
class EmployeeUpdate(EmployeeBase):
    pass

class EmployeeInDBBase(EmployeeBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True

# Additional properties to return via API
class Employee(EmployeeInDBBase):
    pass

# Additional properties stored in DB
class EmployeeInDB(EmployeeInDBBase):
    pass
