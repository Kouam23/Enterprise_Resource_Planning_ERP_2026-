from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class FeeStructure(Base):
    id = Column(Integer, primary_key=True, index=True)
    program_id = Column(Integer, ForeignKey("program.id"), nullable=False, unique=True)
    amount = Column(Float, nullable=False)
    term = Column(String) # e.g. "Annual", "Semester"
    
    # Relationships
    program = relationship("Program")
    invoices = relationship("TuitionInvoice", back_populates="fee_structure")
