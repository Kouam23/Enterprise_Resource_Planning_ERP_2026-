from app.crud.base import CRUDBase
from app.models.payroll import Payroll
from app.models.leave import LeaveRequest
from app.models.asset import Asset
from app.models.attendance import Attendance
from app.models.performance import OKR, PerformanceReview
from app.schemas.hr_ext import (
    PayrollCreate, PayrollUpdate,
    LeaveRequestCreate, LeaveRequestUpdate,
    AssetCreate, AssetUpdate,
    AttendanceCreate, AttendanceUpdate,
    OKRCreate, OKRUpdate,
    PerformanceReviewCreate
)

class CRUDPayroll(CRUDBase[Payroll, PayrollCreate, PayrollUpdate]):
    pass

class CRUDLeave(CRUDBase[LeaveRequest, LeaveRequestCreate, LeaveRequestUpdate]):
    pass

class CRUDAsset(CRUDBase[Asset, AssetCreate, AssetUpdate]):
    pass

class CRUDAttendance(CRUDBase[Attendance, AttendanceCreate, AttendanceUpdate]):
    pass

class CRUDOKR(CRUDBase[OKR, OKRCreate, OKRUpdate]):
    pass

class CRUDPerformance(CRUDBase[PerformanceReview, PerformanceReviewCreate, Any]):
    pass

payroll = CRUDPayroll(Payroll)
leave = CRUDLeave(LeaveRequest)
asset = CRUDAsset(Asset)
attendance = CRUDAttendance(Attendance)
okr = CRUDOKR(OKR)
performance = CRUDPerformance(PerformanceReview)
