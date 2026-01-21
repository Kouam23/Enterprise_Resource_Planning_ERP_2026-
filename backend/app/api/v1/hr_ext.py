from typing import Any, List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.api import deps
from app.models.performance import OKR as OKRModel
from app.crud.crud_hr_ext import (
    payroll as crud_payroll, 
    leave as crud_leave, 
    asset as crud_asset,
    attendance as crud_attendance,
    okr as crud_okr,
    performance as crud_performance
)
from app.schemas.hr_ext import (
    Payroll, PayrollCreate, PayrollUpdate,
    LeaveRequest, LeaveRequestCreate, LeaveRequestUpdate,
    Asset, AssetCreate, AssetUpdate,
    Attendance, AttendanceCreate,
    OKR, OKRCreate,
    PerformanceReview, PerformanceReviewCreate
)
from app.services.hr_service import hr_service

router = APIRouter()

# --- Payroll Endpoints ---
@router.post("/payroll/generate")
async def generate_payroll(
    month: int,
    year: int,
    db: AsyncSession = Depends(deps.get_db),
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator"]))
) -> Any:
    return await hr_service.generate_monthly_payroll(db, month=month, year=year)

@router.get("/payroll", response_model=List[Payroll])
async def read_payroll(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    return await crud_payroll.get_multi(db, skip=skip, limit=limit)

@router.post("/payroll/{id}/approve")
async def approve_payroll(
    id: int,
    db: AsyncSession = Depends(deps.get_db),
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator"]))
) -> Any:
    return await hr_service.approve_payroll(db, payroll_id=id)

# --- Leave Endpoints ---
@router.post("/leave", response_model=LeaveRequest)
async def request_leave(
    *,
    db: AsyncSession = Depends(deps.get_db),
    leave_in: LeaveRequestCreate,
) -> Any:
    return await crud_leave.create(db, obj_in=leave_in)

@router.get("/leave", response_model=List[LeaveRequest])
async def read_leaves(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    return await crud_leave.get_multi(db, skip=skip, limit=limit)

# --- Asset Endpoints ---
@router.get("/assets", response_model=List[Asset])
async def read_assets(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    return await crud_asset.get_multi(db, skip=skip, limit=limit)

@router.post("/assets", response_model=Asset)
async def create_asset(
    *,
    db: AsyncSession = Depends(deps.get_db),
    asset_in: AssetCreate,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator", "Staff"]))
) -> Any:
    return await crud_asset.create(db, obj_in=asset_in)

@router.put("/assets/{id}", response_model=Asset)
async def update_asset(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    asset_in: AssetUpdate,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator", "Staff"]))
) -> Any:
    db_obj = await crud_asset.get(db, id=id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Asset not found")
    return await crud_asset.update(db, db_obj=db_obj, obj_in=asset_in)

# --- Attendance Endpoints ---
@router.post("/attendance/check-in", response_model=Attendance)
async def check_in(
    *,
    db: AsyncSession = Depends(deps.get_db),
    att_in: AttendanceCreate,
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    # Ensure user can only check in for themselves or is admin
    if att_in.employee_id != current_user.id and current_user.role.name not in ["Super Admin", "Administrator"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return await crud_attendance.create(db, obj_in=att_in)

@router.post("/attendance/{id}/check-out", response_model=Attendance)
async def check_out(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    db_obj = await crud_attendance.get(db, id=id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    
    if db_obj.employee_id != current_user.id and current_user.role.name not in ["Super Admin", "Administrator"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    return await crud_attendance.update(db, db_obj=db_obj, obj_in={"check_out": datetime.now()})

@router.get("/attendance", response_model=List[Attendance])
async def read_attendance(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator", "Staff"]))
) -> Any:
    return await crud_attendance.get_multi(db, skip=skip, limit=limit)

# --- Performance & OKR Endpoints ---
@router.get("/okrs", response_model=List[OKR])
async def read_okrs(
    db: AsyncSession = Depends(deps.get_db),
    employee_id: Optional[int] = None,
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    # Users can see their own OKRs, or admins/staff can see all
    if employee_id and employee_id != current_user.id and current_user.role.name not in ["Super Admin", "Administrator", "Staff"]:
         raise HTTPException(status_code=403, detail="Not enough permissions")
         
    if employee_id:
        result = await db.execute(select(OKRModel).where(OKRModel.employee_id == employee_id))
        return result.scalars().all()
    
    if current_user.role.name not in ["Super Admin", "Administrator", "Staff"]:
         result = await db.execute(select(OKRModel).where(OKRModel.employee_id == current_user.id))
         return result.scalars().all()
         
    return await crud_okr.get_multi(db)

@router.post("/okrs", response_model=OKR)
async def create_okr(
    *,
    db: AsyncSession = Depends(deps.get_db),
    okr_in: OKRCreate,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator", "Staff"]))
) -> Any:
    return await crud_okr.create(db, obj_in=okr_in)

@router.post("/reviews", response_model=PerformanceReview)
async def create_review(
    *,
    db: AsyncSession = Depends(deps.get_db),
    review_in: PerformanceReviewCreate,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator"]))
) -> Any:
    return await crud_performance.create(db, obj_in=review_in)
