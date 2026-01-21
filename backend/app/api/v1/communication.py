from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.api import deps
from app.schemas.communication import (
    NoticeCreate, Notice as NoticeSchema,
    ForumPostCreate, ForumPost as ForumPostSchema,
    ForumCommentCreate, ForumComment as ForumCommentSchema,
    MessageCreate, Message as MessageSchema
)
from app.models.communication import Notice, ForumPost, ForumComment, Message
from sqlalchemy import or_, and_

router = APIRouter()

@router.get("/notices", response_model=List[NoticeSchema])
async def read_notices(
    db: AsyncSession = Depends(deps.get_db),
    category: str = None
) -> Any:
    query = select(Notice)
    if category:
        query = query.where(Notice.category == category)
    result = await db.execute(query.order_by(Notice.created_at.desc()))
    return result.scalars().all()

@router.post("/notices", response_model=NoticeSchema)
async def create_notice(
    *,
    db: AsyncSession = Depends(deps.get_db),
    notice_in: NoticeCreate
) -> Any:
    obj = Notice(**notice_in.dict())
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj

@router.get("/forum", response_model=List[ForumPostSchema])
async def read_forum(
    db: AsyncSession = Depends(deps.get_db),
    topic: str = None
) -> Any:
    query = select(ForumPost)
    if topic:
        query = query.where(ForumPost.topic == topic)
    result = await db.execute(query.order_by(ForumPost.created_at.desc()))
    return result.scalars().all()

@router.post("/forum", response_model=ForumPostSchema)
async def create_forum_post(
    *,
    db: AsyncSession = Depends(deps.get_db),
    post_in: ForumPostCreate
) -> Any:
    obj = ForumPost(**post_in.dict())
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj

@router.post("/forum/comment", response_model=ForumCommentSchema)
async def create_comment(
    *,
    db: AsyncSession = Depends(deps.get_db),
    comment_in: ForumCommentCreate
) -> Any:
    obj = ForumComment(**comment_in.dict())
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj

@router.get("/messages/{user_id}", response_model=List[MessageSchema])
async def read_messages(
    user_id: int,
    other_id: int,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """
    Get message history between current user and another user.
    """
    query = select(Message).where(
        or_(
            and_(Message.sender_id == user_id, Message.receiver_id == other_id),
            and_(Message.sender_id == other_id, Message.receiver_id == user_id)
        )
    ).order_by(Message.created_at.asc())
    result = await db.execute(query)
    messages = result.scalars().all()
    return messages

@router.post("/messages", response_model=MessageSchema)
async def send_message(
    *,
    db: AsyncSession = Depends(deps.get_db),
    message_in: MessageCreate,
    sender_id: int
) -> Any:
    obj = Message(**message_in.dict(), sender_id=sender_id)
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj
