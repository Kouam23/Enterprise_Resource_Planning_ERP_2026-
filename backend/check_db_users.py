
import asyncio
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.user import User

async def check_users():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User))
        users = result.scalars().all()
        print(f"Found {len(users)} users:")
        for user in users:
            print(f"- ID: {user.id}, Email: {user.email}, Full Name: {user.full_name}, Is Active: {user.is_active}, Role ID: {user.role_id}")

if __name__ == "__main__":
    asyncio.run(check_users())
