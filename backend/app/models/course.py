from sqlalchemy import Column, Integer, String, Text
from app.db.base_class import Base

class Course(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text)
    credits = Column(Integer, default=3)
    code = Column(String, unique=True, index=True, nullable=False)
