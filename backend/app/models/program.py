from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Program(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    code = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text)
    total_credits = Column(Integer, default=120)
    version = Column(String, default="1.0")
    
    # Relationships
    students = relationship("Student", back_populates="program")
    courses = relationship("Course", secondary="program_course_association", back_populates="programs")

class ProgramCourseAssociation(Base):
    __tablename__ = "program_course_association"
    program_id = Column(Integer, ForeignKey("program.id"), primary_key=True)
    course_id = Column(Integer, ForeignKey("course.id"), primary_key=True)
