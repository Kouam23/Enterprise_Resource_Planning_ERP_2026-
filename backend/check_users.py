import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, selectinload
from sqlalchemy import select
from app.models.user import User
from app.models.role import Role
from app.core.config import settings

async def check_users():
    engine = create_async_engine(settings.DATABASE_URI)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as db:
        result = await db.execute(select(User).options(selectinload(User.role)))
        users = result.scalars().all()
        
        print(f"{'ID':<5} {'Email':<25} {'Full Name':<20} {'Role':<15}")
        print("-" * 70)
        for user in users:
            role_name = user.role.name if user.role else "None"
            print(f"{user.id:<5} {user.email:<25} {user.full_name:<20} {role_name:<15}")

if __name__ == "__main__":
    asyncio.run(check_users())
