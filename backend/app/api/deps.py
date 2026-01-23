from typing import Generator, Optional, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import security
from app.core.config import settings
from app.db.session import get_db
from app.models.user import User
from app.schemas.token import TokenPayload
from app.crud.crud_user import user as crud_user
from app.models.role import Role
from app.services.audit_service import audit_service

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(reusable_oauth2)
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    from sqlalchemy.orm import selectinload
    from sqlalchemy import select
    result = await db.execute(
        select(User).where(User.id == token_data.sub).options(selectinload(User.role))
    )
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user

async def get_current_user_optional(
    db: AsyncSession = Depends(get_db),
    token: Optional[str] = Depends(OAuth2PasswordBearer(
        tokenUrl=f"{settings.API_V1_STR}/auth/login", 
        auto_error=False
    ))
) -> Optional[User]:
    """
    Return User if valid token is provided, else None.
    Do NOT raise 401/403.
    """
    if not token:
        return None
        
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        return None
        
    from sqlalchemy.orm import selectinload
    from sqlalchemy import select
    result = await db.execute(
        select(User).where(User.id == token_data.sub).options(selectinload(User.role))
    )
    user = result.scalars().first()
    if not user or not user.is_active:
        return None
        
    return user

class RoleChecker:
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    async def __call__(
        self,
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
    ) -> User:
        role_result = await db.get(Role, current_user.role_id)
        if not role_result:
            raise HTTPException(status_code=403, detail="Role not found")
        
        # Super Admin bypass
        if role_result.name == "Super Admin":
            return current_user
            
        # Check if the required role is in allowed_roles
        if role_result.name not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(self.allowed_roles)}",
            )
        return current_user

def get_current_active_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.role_id != 1: 
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return current_user
