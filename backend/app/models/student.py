from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Student(Base):
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    enrollment_date = Column(Date)
    matricule = Column(String, unique=True, index=True, nullable=True) # e.g. ICTU2023001
    status = Column(String, default="active") # active, inactive, graduated
    
    # Academic Metrics
    cumulative_gpa = Column(Float, default=0.0)
    total_credits_earned = Column(Integer, default=0)
    
    # New fields
    program_id = Column(Integer, ForeignKey("program.id"))
    
    # Relationships
    program = relationship("Program", back_populates="students")
    grades = relationship("Grade", back_populates="student")
