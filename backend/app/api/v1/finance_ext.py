from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud.crud_finance_ext import vendor as crud_vendor, installment as crud_installment
from app.schemas.finance_ext import (
    Vendor, VendorCreate, VendorUpdate,
    TuitionInstallment, TuitionInstallmentCreate, TuitionInstallmentUpdate
)

router = APIRouter()

# --- Vendor Endpoints ---
@router.get("/vendors", response_model=List[Vendor])
async def read_vendors(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    return await crud_vendor.get_multi(db, skip=skip, limit=limit)

@router.post("/vendors", response_model=Vendor)
async def create_vendor(
    *,
    db: AsyncSession = Depends(deps.get_db),
    vendor_in: VendorCreate,
) -> Any:
    return await crud_vendor.create(db, obj_in=vendor_in)

@router.put("/vendors/{id}", response_model=Vendor)
async def update_vendor(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    vendor_in: VendorUpdate,
) -> Any:
    db_obj = await crud_vendor.get(db, id=id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return await crud_vendor.update(db, db_obj=db_obj, obj_in=vendor_in)

# --- Installment Endpoints ---
@router.get("/installments", response_model=List[TuitionInstallment])
async def read_installments(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    return await crud_installment.get_multi(db, skip=skip, limit=limit)

@router.post("/installments", response_model=TuitionInstallment)
async def create_installment(
    *,
    db: AsyncSession = Depends(deps.get_db),
    inst_in: TuitionInstallmentCreate,
) -> Any:
    return await crud_installment.create(db, obj_in=inst_in)
