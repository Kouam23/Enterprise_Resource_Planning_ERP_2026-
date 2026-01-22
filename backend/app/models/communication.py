from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Notice(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String, default="General") # General, Academic, Finance, Events
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    author_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    target_role_id = Column(Integer, ForeignKey("role.id"), nullable=True) # NULL means "All Roles"

    author = relationship("User")
    target_role = relationship("Role")

class ForumPost(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    content = Column(Text, nullable=False)
    topic = Column(String, index=True) # e.g. "Computer Science", "Admissions"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    author_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    target_role_id = Column(Integer, ForeignKey("role.id"), nullable=True)
    
    author = relationship("User")
    target_role = relationship("Role")
    comments = relationship("ForumComment", back_populates="post", cascade="all, delete-orphan")

class ForumComment(Base):
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("forumpost.id"))
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    author_id = Column(Integer, ForeignKey("user.id"), nullable=True)

    post = relationship("ForumPost", back_populates="comments")
    author = relationship("User")

class Message(Base):
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("user.id"))
    receiver_id = Column(Integer, ForeignKey("user.id"))
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_read = Column(Boolean, default=False)
    is_encrypted = Column(Boolean, default=False)
    encryption_hash = Column(String, nullable=True)

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])
