from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class ExpenseApproval(Base):
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True) # Salary, Utility, Maintenance, Marketing
    vendor_id = Column(Integer, ForeignKey("vendor.id"), nullable=True)
    amount = Column(Float, nullable=False)
    description = Column(Text)
    status = Column(String, default="pending") # pending, approved, rejected, disbursed
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    approved_at = Column(DateTime(timezone=True), nullable=True)
    receipt_path = Column(String, nullable=True)
    
    vendor = relationship("Vendor", back_populates="expenses")
