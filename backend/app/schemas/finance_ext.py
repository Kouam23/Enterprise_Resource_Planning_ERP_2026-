from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

# Vendor Schemas
class VendorBase(BaseModel):
    name: str
    category: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    payment_terms: Optional[str] = None

class VendorCreate(VendorBase):
    pass

class VendorUpdate(VendorBase):
    name: Optional[str] = None

class Vendor(VendorBase):
    id: int
    class Config:
        from_attributes = True

# Installment Schemas
class TuitionInstallmentBase(BaseModel):
    invoice_id: int
    amount: float
    due_date: Optional[datetime] = None
    status: Optional[str] = "pending"

class TuitionInstallmentCreate(TuitionInstallmentBase):
    pass

class TuitionInstallmentUpdate(TuitionInstallmentBase):
    invoice_id: Optional[int] = None
    amount: Optional[float] = None

class TuitionInstallment(TuitionInstallmentBase):
    id: int
    paid_at: Optional[datetime] = None
    class Config:
        from_attributes = True
