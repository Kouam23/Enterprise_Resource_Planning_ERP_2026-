from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Scholarship(Base):
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student.id"), nullable=False)
    amount = Column(Float, nullable=False)
    scholarship_type = Column(String) # Merit, Need-based, Athletic
    description = Column(String)
    
    # Relationships
    student = relationship("Student")
