
import asyncio
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.role import Role

async def init_db():
    async with AsyncSessionLocal() as db:
        # Check if roles already exist
        result = await db.execute(select(Role))
        roles = result.scalars().all()
        
        if roles:
            print("Roles already exist. Skipping seeding.")
            return

        print("Seeding roles...")
        initial_roles = [
            {"id": 1, "name": "Admin", "permissions": {"all": True}},
            {"id": 2, "name": "Staff", "permissions": {"read": True, "write": True}},
            {"id": 3, "name": "Teacher", "permissions": {"read": True, "grades": True}},
            {"id": 4, "name": "Student", "permissions": {"read": True}},
        ]
        
        for role_data in initial_roles:
            role = Role(**role_data)
            db.add(role)
        
        await db.commit()
        print("Roles seeded successfully!")

if __name__ == "__main__":
    asyncio.run(init_db())
