from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud.crud_program import program as crud_program
from app.schemas.program import Program, ProgramCreate, ProgramUpdate

router = APIRouter()

@router.get("/", response_model=List[Program])
async def read_programs(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve programs.
    """
    programs = await crud_program.get_multi(db, skip=skip, limit=limit)
    return programs

@router.post("/", response_model=Program)
async def create_program(
    *,
    db: AsyncSession = Depends(deps.get_db),
    program_in: ProgramCreate,
) -> Any:
    """
    Create new program.
    """
    program = await crud_program.create(db, obj_in=program_in)
    return program

@router.get("/{id}", response_model=Program)
async def read_program(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get program by ID.
    """
    program = await crud_program.get(db, id=id)
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return program

@router.put("/{id}", response_model=Program)
async def update_program(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    program_in: ProgramUpdate,
) -> Any:
    """
    Update a program.
    """
    program = await crud_program.get(db, id=id)
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    program = await crud_program.update(db, db_obj=program, obj_in=program_in)
    return program

@router.delete("/{id}", response_model=Program)
async def delete_program(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Delete a program.
    """
    program = await crud_program.get(db, id=id)
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    program = await crud_program.remove(db, id=id)
    return program
