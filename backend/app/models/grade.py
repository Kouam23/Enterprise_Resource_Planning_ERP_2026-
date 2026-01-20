from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Grade(Base):
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("course.id"), nullable=False)
    assessment_type = Column(String, nullable=False) # assignment, quiz, midterm, final
    score = Column(Float, nullable=False)
    weight = Column(Float, default=1.0)
    date = Column(DateTime(timezone=True), server_default=func.now())
    term = Column(String) # e.g. "Spring 2026"
    
    # Relationships
    student = relationship("Student", back_populates="grades")
    course = relationship("Course", back_populates="grades")
