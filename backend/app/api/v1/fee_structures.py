from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud.crud_fee_structure import fee_structure as crud_fee_structure
from app.schemas.fee_structure import FeeStructure, FeeStructureCreate, FeeStructureUpdate

router = APIRouter()

@router.get("/", response_model=List[FeeStructure])
async def read_fee_structures(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    return await crud_fee_structure.get_multi(db, skip=skip, limit=limit)

@router.post("/", response_model=FeeStructure)
async def create_fee_structure(
    *,
    db: AsyncSession = Depends(deps.get_db),
    fee_structure_in: FeeStructureCreate,
) -> Any:
    return await crud_fee_structure.create(db, obj_in=fee_structure_in)

@router.put("/{id}", response_model=FeeStructure)
async def update_fee_structure(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    fee_structure_in: FeeStructureUpdate,
) -> Any:
    db_obj = await crud_fee_structure.get(db, id=id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Fee structure not found")
    return await crud_fee_structure.update(db, db_obj=db_obj, obj_in=fee_structure_in)

@router.get("/{id}", response_model=FeeStructure)
async def read_fee_structure(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    db_obj = await crud_fee_structure.get(db, id=id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Fee structure not found")
    return db_obj

@router.delete("/{id}", response_model=FeeStructure)
async def delete_fee_structure(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    db_obj = await crud_fee_structure.get(db, id=id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Fee structure not found")
    return await crud_fee_structure.remove(db, id=id)
