import asyncio
from app.db.session import AsyncSessionLocal
from app.db.base import Base
from app.models.course import Course
from sqlalchemy import select

async def check():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Course))
        courses = result.scalars().all()
        print(f"Total courses found: {len(courses)}")
        for c in courses:
            print(f"ID: {c.id} | Code: {c.code} | Title: {c.title}")

if __name__ == "__main__":
    asyncio.run(check())
