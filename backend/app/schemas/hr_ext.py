from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel

# Payroll Schemas
class PayrollBase(BaseModel):
    employee_id: int
    month: int
    year: int
    base_salary: float
    allowances: Optional[float] = 0.0
    deductions: Optional[float] = 0.0
    tax: Optional[float] = 0.0
    net_pay: float
    status: Optional[str] = "pending"

class PayrollCreate(PayrollBase):
    pass

class PayrollUpdate(PayrollBase):
    month: Optional[int] = None
    year: Optional[int] = None
    base_salary: Optional[float] = None
    net_pay: Optional[float] = None

class Payroll(PayrollBase):
    id: int
    created_at: datetime
    paid_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# Leave Schemas
class LeaveRequestBase(BaseModel):
    employee_id: int
    leave_type: str
    start_date: date
    end_date: date
    reason: Optional[str] = None
    status: Optional[str] = "pending"

class LeaveRequestCreate(LeaveRequestBase):
    pass

class LeaveRequestUpdate(LeaveRequestBase):
    leave_type: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class LeaveRequest(LeaveRequestBase):
    id: int
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# Asset Schemas
class AssetBase(BaseModel):
    name: str
    code: str
    category: Optional[str] = None
    value: Optional[float] = None
    purchase_date: Optional[date] = None
    assigned_to: Optional[int] = None
    status: Optional[str] = "available"

class AssetCreate(AssetBase):
    pass

class AssetUpdate(AssetBase):
    name: Optional[str] = None
    code: Optional[str] = None
    status: Optional[str] = None

class Asset(AssetBase):
    id: int
    last_audit_date: Optional[datetime] = None
    next_maintenance_date: Optional[datetime] = None
    qr_code_data: Optional[str] = None
    class Config:
        from_attributes = True

# Attendance Schemas
class AttendanceBase(BaseModel):
    employee_id: int
    status: Optional[str] = "present"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    device_id: Optional[str] = None
    location_name: Optional[str] = None

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceUpdate(BaseModel):
    check_out: Optional[datetime] = None
    status: Optional[str] = None

class Attendance(AttendanceBase):
    id: int
    check_in: datetime
    check_out: Optional[datetime] = None
    class Config:
        from_attributes = True

# Performance Schemas
class OKRBase(BaseModel):
    employee_id: int
    objective: str
    key_results: Optional[str] = None
    progress: Optional[float] = 0.0
    period: Optional[str] = None
    status: Optional[str] = "active"

class OKRCreate(OKRBase):
    pass

class OKRUpdate(OKRBase):
    objective: Optional[str] = None

class OKR(OKRBase):
    id: int
    class Config:
        from_attributes = True

class PerformanceReviewBase(BaseModel):
    employee_id: int
    reviewer_id: int
    rating: int
    feedback: str
    review_type: Optional[str] = "Annual"

class PerformanceReviewCreate(PerformanceReviewBase):
    pass

class PerformanceReview(PerformanceReviewBase):
    id: int
    review_date: datetime
    class Config:
        from_attributes = True
