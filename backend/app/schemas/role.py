from typing import Optional, Dict, Any
from pydantic import BaseModel

# Shared properties
class RoleBase(BaseModel):
    name: Optional[str] = None
    permissions: Optional[Dict[str, Any]] = {}

# Properties to receive via API on creation
class RoleCreate(RoleBase):
    name: str

# Properties to receive via API on update
class RoleUpdate(RoleBase):
    pass

class RoleInDBBase(RoleBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True

# Additional properties to return via API
class Role(RoleInDBBase):
    pass
