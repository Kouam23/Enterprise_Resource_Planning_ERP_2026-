from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class TuitionInstallment(Base):
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("tuitioninvoice.id"), nullable=False)
    amount = Column(Float, nullable=False)
    due_date = Column(DateTime(timezone=True))
    status = Column(String, default="pending") # pending, paid, overdue
    paid_at = Column(DateTime(timezone=True), nullable=True)
    
    invoice = relationship("TuitionInvoice", back_populates="installments")

class Vendor(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    category = Column(String) # IT, Utilities, Cleaning, Food
    contact_person = Column(String)
    email = Column(String)
    phone = Column(String)
    address = Column(String)
    payment_terms = Column(String) # Net-30, Due-on-receipt
    
    expenses = relationship("ExpenseApproval", back_populates="vendor")
