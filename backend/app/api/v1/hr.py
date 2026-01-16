from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud.crud_employee import employee as crud_employee
from app.schemas.employee import Employee, EmployeeCreate, EmployeeUpdate

router = APIRouter()

@router.get("/", response_model=List[Employee])
async def read_employees(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve employees.
    """
    employees = await crud_employee.get_multi(db, skip=skip, limit=limit)
    return employees

@router.post("/", response_model=Employee)
async def create_employee(
    *,
    db: AsyncSession = Depends(deps.get_db),
    employee_in: EmployeeCreate,
) -> Any:
    """
    Create new employee.
    """
    employee = await crud_employee.create(db, obj_in=employee_in)
    return employee

@router.get("/{id}", response_model=Employee)
async def read_employee(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get employee by ID.
    """
    employee = await crud_employee.get(db, id=id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee
