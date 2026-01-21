from datetime import datetime
from typing import Optional, Any, Dict
from pydantic import BaseModel

class AuditLogBase(BaseModel):
    user_id: Optional[int] = None
    action: str
    target_table: str
    target_id: Optional[int] = None
    changes: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None

class AuditLogCreate(AuditLogBase):
    pass

class AuditLog(AuditLogBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True
