from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.base_class import Base

class Transaction(Base):
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True, nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(String, nullable=False) # income, expense
    category = Column(String, index=True) # tuition, salary, supplies, utilities
    date = Column(DateTime(timezone=True), server_default=func.now())
