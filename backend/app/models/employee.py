from sqlalchemy import Column, Integer, String, Date, Float
from app.db.base_class import Base

class Employee(Base):
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    position = Column(String, index=True)
    department = Column(String, index=True)
    salary = Column(Float)
    hire_date = Column(Date)
    status = Column(String, default="active") # active, on_leave, terminated
