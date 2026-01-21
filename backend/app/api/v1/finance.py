from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud.crud_transaction import transaction as crud_transaction
from app.schemas.transaction import Transaction, TransactionCreate, TransactionUpdate

router = APIRouter()

@router.get("/stats")
async def get_finance_stats(
    db: AsyncSession = Depends(deps.get_db),
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator", "Staff"]))
) -> Any:
    transactions = await crud_transaction.get_multi(db, limit=1000)
    income = sum(t.amount for t in transactions if t.type == "income")
    expenses = sum(t.amount for t in transactions if t.type == "expense")
    return {
        "total_income": income,
        "total_expenses": expenses,
        "net_profit": income - expenses,
        "transaction_count": len(transactions)
    }

@router.post("/apply-late-fees")
async def apply_late_fees(
    db: AsyncSession = Depends(deps.get_db),
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator"]))
) -> Any:
    return await finance_service.apply_late_fees(db)

@router.get("/recruitment-funnel")
async def get_funnel(
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    return await finance_service.get_recruitment_funnel(db)

@router.get("/", response_model=List[Transaction])
async def read_transactions(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve transactions.
    """
    transactions = await crud_transaction.get_multi(db, skip=skip, limit=limit)
    return transactions

@router.post("/", response_model=Transaction)
async def create_transaction(
    *,
    db: AsyncSession = Depends(deps.get_db),
    transaction_in: TransactionCreate,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator", "Staff"]))
) -> Any:
    """
    Create new transaction.
    """
    transaction = await crud_transaction.create(db, obj_in=transaction_in)
    return transaction

@router.get("/{id}", response_model=Transaction)
async def read_transaction(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get transaction by ID.
    """
    transaction = await crud_transaction.get(db, id=id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@router.put("/{id}", response_model=Transaction)
async def update_transaction(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    transaction_in: TransactionUpdate,
) -> Any:
    """
    Update a transaction.
    """
    transaction = await crud_transaction.get(db, id=id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    transaction = await crud_transaction.update(db, db_obj=transaction, obj_in=transaction_in)
    return transaction

@router.delete("/{id}", response_model=Transaction)
async def delete_transaction(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Delete a transaction.
    """
    transaction = await crud_transaction.get(db, id=id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    transaction = await crud_transaction.remove(db, id=id)
    return transaction
