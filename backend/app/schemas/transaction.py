from typing import Optional
from datetime import datetime
from pydantic import BaseModel

# Shared properties
class TransactionBase(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = None
    type: Optional[str] = None
    category: Optional[str] = None
    date: Optional[datetime] = None

# Properties to receive via API on creation
class TransactionCreate(TransactionBase):
    description: str
    amount: float
    type: str # income, expense

# Properties to receive via API on update
class TransactionUpdate(TransactionBase):
    pass

class TransactionInDBBase(TransactionBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True

# Additional properties to return via API
class Transaction(TransactionInDBBase):
    pass

# Additional properties stored in DB
class TransactionInDB(TransactionInDBBase):
    pass
