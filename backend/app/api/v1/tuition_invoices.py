from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud.crud_tuition_invoice import tuition_invoice as crud_tuition_invoice
from app.schemas.tuition_invoice import TuitionInvoice, TuitionInvoiceCreate, TuitionInvoiceUpdate

from app.services.finance_service import finance_service

router = APIRouter()

@router.post("/generate-bulk/{program_id}")
async def bulk_invoice(
    program_id: int,
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    return await finance_service.generate_invoices_for_program(db, program_id=program_id)

@router.get("/", response_model=List[TuitionInvoice])
async def read_tuition_invoices(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    return await crud_tuition_invoice.get_multi(db, skip=skip, limit=limit)

@router.post("/", response_model=TuitionInvoice)
async def create_tuition_invoice(
    *,
    db: AsyncSession = Depends(deps.get_db),
    invoice_in: TuitionInvoiceCreate,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator", "Staff"]))
) -> Any:
    return await crud_tuition_invoice.create(db, obj_in=invoice_in)

@router.put("/{id}", response_model=TuitionInvoice)
async def update_tuition_invoice(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    invoice_in: TuitionInvoiceUpdate,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator", "Staff"]))
) -> Any:
    db_obj = await crud_tuition_invoice.get(db, id=id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return await crud_tuition_invoice.update(db, db_obj=db_obj, obj_in=invoice_in)

@router.get("/{id}", response_model=TuitionInvoice)
async def read_tuition_invoice(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    db_obj = await crud_tuition_invoice.get(db, id=id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return db_obj

@router.post("/{id}/pay")
async def pay_invoice(
    id: int,
    amount: float,
    db: AsyncSession = Depends(deps.get_db),
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator", "Staff"]))
) -> Any:
    return await finance_service.record_payment(db, invoice_id=id, amount=amount)
