import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.models.user import User
from app.core.security import verify_password, get_password_hash
from app.core.config import settings

async def verify_stored_users():
    engine = create_async_engine(settings.DATABASE_URI)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as db:
        result = await db.execute(select(User))
        users = result.scalars().all()
        
        test_pw = "password123"
        print(f"{'Email':<25} {'Matches password123?':<20}")
        print("-" * 50)
        for user in users:
            matches = verify_password(test_pw, user.hashed_password)
            print(f"{user.email:<25} {str(matches):<20}")
            
            # If it doesn't match, let's see what a fresh hash looks like
            if not matches:
                new_hash = get_password_hash(test_pw)
                print(f"  [DEBUG] Current Hash: {user.hashed_password}")
                print(f"  [DEBUG] Fresh Hash:   {new_hash}")

if __name__ == "__main__":
    asyncio.run(verify_stored_users())
