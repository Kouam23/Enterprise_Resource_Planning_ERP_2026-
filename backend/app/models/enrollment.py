from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Enrollment(Base):
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("course.id"), nullable=False)
    term = Column(String, nullable=False) # e.g. "Fall 2026"
    status = Column(String, default="enrolled") # enrolled, dropped, completed
    enrollment_date = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    student = relationship("Student", backref="enrollments")
    course = relationship("Course", backref="enrollments")
