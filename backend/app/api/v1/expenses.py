import os
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import func
from app.api import deps
from app.crud.crud_expense import expense_approval as crud_expense
from app.schemas.expense import ExpenseApproval, ExpenseApprovalCreate, ExpenseApprovalUpdate

router = APIRouter()

@router.get("/", response_model=List[ExpenseApproval])
async def read_expenses(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    return await crud_expense.get_multi(db, skip=skip, limit=limit)

@router.post("/", response_model=ExpenseApproval)
async def create_expense(
    *,
    db: AsyncSession = Depends(deps.get_db),
    expense_in: ExpenseApprovalCreate,
) -> Any:
    return await crud_expense.create(db, obj_in=expense_in)

@router.patch("/{id}/approve", response_model=ExpenseApproval)
async def approve_expense(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    db_obj = await crud_expense.get(db, id=id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Expense not found")
    return await crud_expense.update(db, db_obj=db_obj, obj_in={"status": "approved", "approved_at": func.now()})

@router.patch("/{id}/reject", response_model=ExpenseApproval)
async def reject_expense(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    db_obj = await crud_expense.get(db, id=id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Expense not found")
    return await crud_expense.update(db, db_obj=db_obj, obj_in={"status": "rejected"})

@router.post("/{id}/upload-receipt")
async def upload_receipt(
    id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    db_obj = await crud_expense.get(db, id=id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Expense not found")
        
    upload_dir = "uploads/receipts"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, f"{id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
        
    return await crud_expense.update(db, db_obj=db_obj, obj_in={"receipt_path": file_path})
