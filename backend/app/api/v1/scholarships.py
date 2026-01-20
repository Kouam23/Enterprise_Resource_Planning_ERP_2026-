from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud.crud_scholarship import scholarship as crud_scholarship
from app.schemas.scholarship import Scholarship, ScholarshipCreate, ScholarshipUpdate

router = APIRouter()

@router.get("/", response_model=List[Scholarship])
async def read_scholarships(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    return await crud_scholarship.get_multi(db, skip=skip, limit=limit)

@router.post("/", response_model=Scholarship)
async def create_scholarship(
    *,
    db: AsyncSession = Depends(deps.get_db),
    scholarship_in: ScholarshipCreate,
) -> Any:
    return await crud_scholarship.create(db, obj_in=scholarship_in)

@router.put("/{id}", response_model=Scholarship)
async def update_scholarship(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    scholarship_in: ScholarshipUpdate,
) -> Any:
    db_obj = await crud_scholarship.get(db, id=id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    return await crud_scholarship.update(db, db_obj=db_obj, obj_in=scholarship_in)

@router.get("/{id}", response_model=Scholarship)
async def read_scholarship(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    db_obj = await crud_scholarship.get(db, id=id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    return db_obj

@router.delete("/{id}", response_model=Scholarship)
async def delete_scholarship(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    db_obj = await crud_scholarship.get(db, id=id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    return await crud_scholarship.remove(db, id=id)
