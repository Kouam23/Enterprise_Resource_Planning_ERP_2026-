from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Grade(Base):
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("course.id"), nullable=False)
    assessment_type = Column(String, nullable=False) # "CA" (30%) or "Final" (70%)
    score = Column(Float, nullable=False)
    weight = Column(Float, default=1.0) # For sub-assessments within CA
    date = Column(DateTime(timezone=True), server_default=func.now())
    term = Column(String) # e.g. "Fall 2026", "Spring 2026", "Summer 2026"
    is_resit = Column(Boolean, default=False)
    
    # Relationships
    student = relationship("Student", back_populates="grades")
    course = relationship("Course", back_populates="grades")
