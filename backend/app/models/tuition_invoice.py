from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class TuitionInvoice(Base):
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student.id"), nullable=False)
    fee_structure_id = Column(Integer, ForeignKey("feestructure.id"), nullable=False)
    amount_due = Column(Float, nullable=False)
    amount_paid = Column(Float, default=0.0)
    late_fee_accumulated = Column(Float, default=0.0)
    status = Column(String, default="unpaid") # unpaid, partial, paid
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    due_date = Column(DateTime(timezone=True))
    
    # Relationships
    student = relationship("Student")
    fee_structure = relationship("FeeStructure", back_populates="invoices")
    installments = relationship("TuitionInstallment", back_populates="invoice")
