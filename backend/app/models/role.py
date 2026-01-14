from sqlalchemy import Column, Integer, String, JSON
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Role(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    permissions = Column(JSON, default={})
    
    users = relationship("User", back_populates="role")
