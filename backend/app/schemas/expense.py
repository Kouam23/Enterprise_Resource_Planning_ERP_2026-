from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class ExpenseApprovalBase(BaseModel):
    category: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    status: Optional[str] = "pending"
    receipt_path: Optional[str] = None

class ExpenseApprovalCreate(ExpenseApprovalBase):
    category: str
    amount: float

class ExpenseApprovalUpdate(ExpenseApprovalBase):
    approved_at: Optional[datetime] = None

class ExpenseApprovalInDBBase(ExpenseApprovalBase):
    id: Optional[int] = None
    submitted_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ExpenseApproval(ExpenseApprovalInDBBase):
    pass
