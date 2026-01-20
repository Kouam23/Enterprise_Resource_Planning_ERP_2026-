from typing import Optional, List
from pydantic import BaseModel

# Shared properties
class ProgramBase(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    total_credits: Optional[int] = 120
    version: Optional[str] = "1.0"

# Properties to receive via API on creation
class ProgramCreate(ProgramBase):
    name: str
    code: str

# Properties to receive via API on update
class ProgramUpdate(ProgramBase):
    pass

class ProgramInDBBase(ProgramBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True

# Additional properties to return via API
class Program(ProgramInDBBase):
    pass

# Additional properties stored in DB
class ProgramInDB(ProgramInDBBase):
    pass
