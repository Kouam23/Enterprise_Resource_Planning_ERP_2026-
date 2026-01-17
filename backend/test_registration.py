
import asyncio
from app.db.session import AsyncSessionLocal
from app.crud.crud_user import user as crud_user
from app.schemas.user import UserCreate

async def test_registration():
    async with AsyncSessionLocal() as db:
        user_in = UserCreate(
            email="test@example.com",
            password="password123",
            full_name="Test User",
            role_id=4, # Student
            is_active=True
        )
        try:
            user = await crud_user.create(db, obj_in=user_in)
            print(f"Successfully created user: {user.email}")
            await db.commit()
        except Exception as e:
            print(f"Error creating user: {e}")

if __name__ == "__main__":
    asyncio.run(test_registration())
