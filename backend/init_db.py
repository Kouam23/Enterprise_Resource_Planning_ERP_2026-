
import asyncio
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.role import Role

async def init_db():
    async with AsyncSessionLocal() as db:
        print("Seeding roles...")
        initial_roles = [
            {"id": 1, "name": "Super Admin", "permissions": {"all": True}},
            {"id": 2, "name": "Administrator", "permissions": {"modules": ["finance", "hr", "academic"], "write": True}},
            {"id": 3, "name": "Instructor", "permissions": {"read": True, "grades": True, "attendance": True}},
            {"id": 4, "name": "Student", "permissions": {"read": True, "view_grades": True}},
            {"id": 5, "name": "Staff", "permissions": {"read": True, "assets": True, "payroll_view": True}},
        ]
        
        for role_data in initial_roles:
            role = Role(**role_data)
            await db.merge(role)
        
        await db.commit()
        print("Roles seeded successfully!")

if __name__ == "__main__":
    asyncio.run(init_db())
