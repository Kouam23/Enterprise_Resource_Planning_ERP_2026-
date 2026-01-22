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
    category: str = None,
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    # Notice logic: Show global notices (target_role_id is NULL) 
    # OR notices specifically targeted at the user's role.
    query = select(Notice).where(
        or_(
            Notice.target_role_id == None,
            Notice.target_role_id == current_user.role_id
        )
    )
    if category:
        query = query.where(Notice.category == category)
    result = await db.execute(query.order_by(Notice.created_at.desc()))
    return result.scalars().all()

@router.post("/notices", response_model=NoticeSchema)
async def create_notice(
    *,
    db: AsyncSession = Depends(deps.get_db),
    notice_in: NoticeCreate,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator"]))
) -> Any:
    obj = Notice(**notice_in.dict(), author_id=current_user.id)
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj

@router.get("/forum", response_model=List[ForumPostSchema])
async def read_forum(
    db: AsyncSession = Depends(deps.get_db),
    topic: str = None,
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    # Forum logic: Every user (role) has their own personalized page
    # where they can connect and discourse with similar users.
    query = select(ForumPost).where(ForumPost.target_role_id == current_user.role_id)
    if topic:
        query = query.where(ForumPost.topic == topic)
    result = await db.execute(query.order_by(ForumPost.created_at.desc()))
    return result.scalars().all()

@router.post("/forum", response_model=ForumPostSchema)
async def create_forum_post(
    *,
    db: AsyncSession = Depends(deps.get_db),
    post_in: ForumPostCreate,
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    # Auto-assign the target_role_id to the sender's role
    obj = ForumPost(
        **post_in.dict(exclude={"target_role_id"}), 
        author_id=current_user.id,
        target_role_id=current_user.role_id
    )
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj

@router.post("/forum/comment", response_model=ForumCommentSchema)
async def create_comment(
    *,
    db: AsyncSession = Depends(deps.get_db),
    comment_in: ForumCommentCreate,
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    obj = ForumComment(**comment_in.dict(), author_id=current_user.id)
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj

@router.get("/messages/{user_id}", response_model=List[MessageSchema])
async def read_messages(
    user_id: int,
    other_id: int,
    db: AsyncSession = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    """
    Get message history between current user and another user.
    """
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
        
    query = select(Message).where(
        or_(
            and_(Message.sender_id == user_id, Message.receiver_id == other_id),
            and_(Message.sender_id == other_id, Message.receiver_id == user_id)
        )
    ).order_by(Message.created_at.asc())
    result = await db.execute(query)
    messages = result.scalars().all()
    return messages

import hashlib
from app.services.integration_service import integration_service
from app.services.audit_service import audit_service

@router.post("/messages", response_model=MessageSchema)
async def send_message(
    *,
    db: AsyncSession = Depends(deps.get_db),
    message_in: MessageCreate,
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    content = message_in.content
    e_hash = None
    if message_in.is_encrypted:
        # Simulate E2EE by hashing the content and storing a 'locked' version
        e_hash = hashlib.sha256(content.encode()).hexdigest()
        content = "[ENCRYPTED CONTENT: " + e_hash[:16] + "...]"

    obj = Message(
        **message_in.dict(exclude={"content"}),
        content=content,
        sender_id=current_user.id,
        encryption_hash=e_hash
    )
    db.add(obj)
    
    # Audit log for sensitive communication
    await audit_service.log_action(
        db,
        user_id=current_user.id,
        action="SEND_MESSAGE",
        target_table="message",
        changes={"is_encrypted": message_in.is_encrypted}
    )
    
    await db.commit()
    await db.refresh(obj)
    return obj

@router.post("/meeting-link")
async def create_meeting(
    topic: str,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin", "Administrator", "Instructor"]))
) -> Any:
    """
    Generate a simulated third-party meeting link.
    """
    return await integration_service.generate_meeting_link(topic)
