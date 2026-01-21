from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class OKR(Base):
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employee.id"), nullable=False)
    objective = Column(String, nullable=False)
    key_results = Column(Text) # JSON or newline separated
    progress = Column(Float, default=0.0) # 0.0 to 100.0
    period = Column(String) # e.g. "Q1 2026"
    status = Column(String, default="active") # active, achieved, deferred

    employee = relationship("Employee")

class PerformanceReview(Base):
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employee.id"), nullable=True)
    reviewer_id = Column(Integer, ForeignKey("employee.id"), nullable=True)
    rating = Column(Integer) # 1-5
    feedback = Column(Text)
    review_date = Column(DateTime(timezone=True), server_default=func.now())
    review_type = Column(String) # 360-degree, Annual, Manager

    employee = relationship("Employee", foreign_keys=[employee_id])
    reviewer = relationship("Employee", foreign_keys=[reviewer_id])
