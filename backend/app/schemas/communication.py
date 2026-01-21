from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class NoticeBase(BaseModel):
    title: str
    content: str
    category: Optional[str] = "General"

class NoticeCreate(NoticeBase):
    pass

class Notice(NoticeBase):
    id: int
    created_at: datetime
    author_id: Optional[int] = None
    class Config:
        from_attributes = True

class ForumCommentBase(BaseModel):
    content: str

class ForumCommentCreate(ForumCommentBase):
    post_id: int

class ForumComment(ForumCommentBase):
    id: int
    post_id: int
    created_at: datetime
    author_id: Optional[int] = None
    class Config:
        from_attributes = True

class ForumPostBase(BaseModel):
    title: str
    content: str
    topic: Optional[str] = "General"

class ForumPostCreate(ForumPostBase):
    pass

class ForumPost(ForumPostBase):
    id: int
    created_at: datetime
    author_id: Optional[int] = None
    comments: List[ForumComment] = []
    class Config:
        from_attributes = True

class MessageBase(BaseModel):
    receiver_id: int
    content: str
    is_encrypted: Optional[bool] = False

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    sender_id: int
    created_at: datetime
    is_read: bool
    is_encrypted: bool
    encryption_hash: Optional[str] = None
    class Config:
        from_attributes = True
