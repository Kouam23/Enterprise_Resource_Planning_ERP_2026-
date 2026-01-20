from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Student(Base):
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    enrollment_date = Column(Date)
    status = Column(String, default="active") # active, inactive, graduated
    
    # New fields
    program_id = Column(Integer, ForeignKey("program.id"))
    
    # Relationships
    program = relationship("Program", back_populates="students")
    grades = relationship("Grade", back_populates="student")
