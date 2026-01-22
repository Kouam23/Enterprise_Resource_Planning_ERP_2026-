import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.models.user import User
from app.models.role import Role
from app.core.security import get_password_hash
from app.core.config import settings

async def seed_users():
    engine = create_async_engine(settings.DATABASE_URI)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as db:
        # Define roles and users
        role_data = [
            "Super Admin",
            "Administrator",
            "Instructor",
            "Student",
            "Staff"
        ]
        
        user_data = [
            {"email": "superadmin@erp.com", "full_name": "Antigravity Super Admin", "role": "Super Admin"},
            {"email": "admin@erp.com", "full_name": "Antigravity Administrator", "role": "Administrator"},
            {"email": "instructor@erp.com", "full_name": "Antigravity Instructor", "role": "Instructor"},
            {"email": "student@erp.com", "full_name": "Antigravity Student", "role": "Student"},
            {"email": "staff@erp.com", "full_name": "Antigravity Staff", "role": "Staff"},
        ]
        
        # 1. Ensure Roles exist
        role_map = {}
        for role_name in role_data:
            result = await db.execute(select(Role).where(Role.name == role_name))
            role = result.scalars().first()
            if not role:
                role = Role(name=role_name, permissions={})
                db.add(role)
                await db.flush()
            role_map[role_name] = role.id
        
        await db.commit()
        
        # 2. Ensure Users exist with correct roles and passwords
        for u in user_data:
            result = await db.execute(select(User).where(User.email == u["email"]))
            user = result.scalars().first()
            
            hashed_pw = get_password_hash("password123")
            role_id = role_map[u["role"]]
            
            if not user:
                print(f"Creating user: {u['email']} as {u['role']}")
                user = User(
                    email=u["email"],
                    full_name=u["full_name"],
                    hashed_password=hashed_pw,
                    role_id=role_id,
                    is_active=True
                )
                db.add(user)
            else:
                print(f"Updating user: {u['email']} to role {u['role']}")
                user.role_id = role_id
                user.hashed_password = hashed_pw # Reset password for consistency
                db.add(user)
        
        await db.commit()
        print("Seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_users())
