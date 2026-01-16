from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud.crud_transaction import transaction as crud_transaction
from app.schemas.transaction import Transaction, TransactionCreate, TransactionUpdate

router = APIRouter()

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
