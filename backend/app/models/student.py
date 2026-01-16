from sqlalchemy import Column, Integer, String, Date
from app.db.base_class import Base

class Student(Base):
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    enrollment_date = Column(Date)
    status = Column(String, default="active") # active, inactive, graduated
