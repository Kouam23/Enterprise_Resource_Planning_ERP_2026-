from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Asset(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    code = Column(String, unique=True, index=True, nullable=False) # Asset Tag
    category = Column(String, index=True) # IT, Furniture, Vehicle
    value = Column(Float)
    purchase_date = Column(Date)
    assigned_to = Column(Integer, ForeignKey("employee.id"), nullable=True)
    status = Column(String, default="available") # available, assigned, maintenance, disposed
    last_audit_date = Column(DateTime(timezone=True), nullable=True)
    next_maintenance_date = Column(DateTime(timezone=True), nullable=True)
    qr_code_data = Column(String, unique=True, nullable=True) # UUID/Asset Tag for QR

    assignee = relationship("Employee")
