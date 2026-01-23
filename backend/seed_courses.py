import asyncio
from app.db.session import AsyncSessionLocal
from app.db.base import Base
from app.models.course import Course
from sqlalchemy import select

async def seed_courses():
    courses_data = [
        {"code": "CSC101", "title": "Introduction to Programming", "credits": 4, "category": "core", "description": "Fundamentals of Python and C++."},
        {"code": "CSC102", "title": "Data Structures & Algorithms", "credits": 4, "category": "core", "description": "Lists, trees, graphs, and efficiency analysis."},
        {"code": "ENG101", "title": "Professional Communication", "credits": 3, "category": "general", "description": "Technical writing and presentation skills."},
        {"code": "MTH101", "title": "Linear Algebra", "credits": 3, "category": "core", "description": "Vectors, matrices, and linear transformations."},
        {"code": "MGT101", "title": "Principles of Management", "credits": 3, "category": "elective", "description": "Organizational theory and behavior."},
        {"code": "WEB101", "title": "Web Development Fundamentals", "credits": 3, "category": "core", "description": "HTML, CSS, and JavaScript basics."},
        {"code": "DBS201", "title": "Database Systems", "credits": 4, "category": "core", "description": "SQL, normalization, and database design."},
        {"code": "NET201", "title": "Computer Networks", "credits": 3, "category": "core", "description": "OSI model, TCP/IP, and network security."},
    ]

    async with AsyncSessionLocal() as db:
        print("Checking for existing courses...")
        existing_courses = await db.execute(select(Course))
        existing_codes = {c.code for c in existing_courses.scalars().all()}
        
        new_courses = []
        for data in courses_data:
            if data["code"] not in existing_codes:
                print(f"Creating course: {data['code']} - {data['title']}")
                course = Course(**data)
                db.add(course)
                new_courses.append(course)
            else:
                print(f"Skipping {data['code']} (already exists)")
        
        if new_courses:
            await db.commit()
            print(f"Successfully added {len(new_courses)} new courses!")
        else:
            print("No new courses to add.")

if __name__ == "__main__":
    asyncio.run(seed_courses())
