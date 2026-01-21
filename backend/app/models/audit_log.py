from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.db.base_class import Base

class AuditLog(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    action = Column(String, index=True) # e.g., "CREATE", "UPDATE", "DELETE", "LOGIN"
    target_table = Column(String, index=True) # e.g., "student", "payroll"
    target_id = Column(Integer, nullable=True)
    changes = Column(JSON, nullable=True) # Store JSON-serialized diff or old/new values
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    ip_address = Column(String, nullable=True)
