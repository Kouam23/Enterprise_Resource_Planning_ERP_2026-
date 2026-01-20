from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.db.base_class import Base

# Association tables for prerequisites and co-requisites
course_prerequisites = Table(
    "course_prerequisites",
    Base.metadata,
    Column("course_id", Integer, ForeignKey("course.id"), primary_key=True),
    Column("prerequisite_id", Integer, ForeignKey("course.id"), primary_key=True),
)

course_corequisites = Table(
    "course_corequisites",
    Base.metadata,
    Column("course_id", Integer, ForeignKey("course.id"), primary_key=True),
    Column("corequisite_id", Integer, ForeignKey("course.id"), primary_key=True),
)

class Course(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text)
    credits = Column(Integer, default=3)
    code = Column(String, unique=True, index=True, nullable=False)
    
    # New fields
    is_mandatory = Column(Boolean, default=True)
    category = Column(String, default="core") # core, elective, general
    capacity = Column(Integer, default=30)
    hours_per_week = Column(Integer, default=3)
    
    # Relationships
    programs = relationship("Program", secondary="program_course_association", back_populates="courses")
    grades = relationship("Grade", back_populates="course")
    
    prerequisites = relationship(
        "Course",
        secondary=course_prerequisites,
        primaryjoin=id == course_prerequisites.c.course_id,
        secondaryjoin=id == course_prerequisites.c.prerequisite_id,
        backref="required_for"
    )
    
    co_requisites = relationship(
        "Course",
        secondary=course_corequisites,
        primaryjoin=id == course_corequisites.c.course_id,
        secondaryjoin=id == course_corequisites.c.corequisite_id,
    )
