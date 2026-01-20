from typing import Optional
from pydantic import BaseModel

class FeeStructureBase(BaseModel):
    program_id: Optional[int] = None
    amount: Optional[float] = None
    term: Optional[str] = "Annual"

class FeeStructureCreate(FeeStructureBase):
    program_id: int
    amount: float

class FeeStructureUpdate(FeeStructureBase):
    pass

class FeeStructureInDBBase(FeeStructureBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True

class FeeStructure(FeeStructureInDBBase):
    pass
