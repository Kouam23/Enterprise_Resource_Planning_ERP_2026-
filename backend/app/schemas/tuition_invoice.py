from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class TuitionInvoiceBase(BaseModel):
    student_id: Optional[int] = None
    fee_structure_id: Optional[int] = None
    amount_due: Optional[float] = None
    amount_paid: Optional[float] = 0.0
    status: Optional[str] = "unpaid"
    due_date: Optional[datetime] = None

class TuitionInvoiceCreate(TuitionInvoiceBase):
    student_id: int
    fee_structure_id: int
    amount_due: float

class TuitionInvoiceUpdate(TuitionInvoiceBase):
    pass

class TuitionInvoiceInDBBase(TuitionInvoiceBase):
    id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TuitionInvoice(TuitionInvoiceInDBBase):
    pass
