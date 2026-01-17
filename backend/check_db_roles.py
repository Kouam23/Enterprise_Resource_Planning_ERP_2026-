
import asyncio
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.role import Role

async def check_roles():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Role))
        roles = result.scalars().all()
        print(f"Found {len(roles)} roles:")
        for role in roles:
            print(f"- ID: {role.id}, Name: {role.name}")

if __name__ == "__main__":
    asyncio.run(check_roles())
