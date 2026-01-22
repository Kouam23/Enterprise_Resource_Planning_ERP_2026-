from datetime import timedelta
from typing import Any, Optional
from pydantic import EmailStr
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.core import security
from app.core.config import settings
from app.crud.crud_user import user as crud_user
from app.schemas.token import Token
from app.schemas.user import User, UserCreate

router = APIRouter()

@router.post("/login", response_model=Token)
async def login_access_token(
    db: AsyncSession = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = await crud_user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/register", response_model=User)
async def register_user(
    *,
    db: AsyncSession = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """
    Register a new user.
    """
    from sqlalchemy.orm import selectinload
    user = await crud_user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = await crud_user.create(db, obj_in=user_in)
    # Refresh user with role relationship loaded
    await db.refresh(user, ["role"])
    return user
@router.post("/sso/{provider}")
async def sso_login(
    provider: str,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """
    Simulate SSO/OAuth login.
    """
    # Simulate finding a user or creating one from SSO provider data
    user = await crud_user.get(db, id=1) # Demo user
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
        "provider": provider
    }

@router.get("/me", response_model=User)
async def read_users_me(
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.put("/me", response_model=User)
async def update_user_me(
    *,
    db: AsyncSession = Depends(deps.get_db),
    password: Optional[str] = None,
    full_name: Optional[str] = None,
    email: Optional[EmailStr] = None,
    profile_picture_url: Optional[str] = None,
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Update own user.
    """
    from app.schemas.user import UserUpdate
    user_in = UserUpdate()
    if password is not None:
        user_in.password = password
    if full_name is not None:
        user_in.full_name = full_name
    if email is not None:
        user_in.email = email
    if profile_picture_url is not None:
        user_in.profile_picture_url = profile_picture_url
        
    user = await crud_user.update(db, db_obj=current_user, obj_in=user_in)
    return user
