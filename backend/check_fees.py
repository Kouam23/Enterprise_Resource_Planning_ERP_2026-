import asyncio
from app.db.session import AsyncSessionLocal
from app.models.fee_structure import FeeStructure
from sqlalchemy import select

async def main():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(FeeStructure))
        fees = result.scalars().all()
        print(f"Fee Structures Found: {len(fees)}")
        for f in fees:
            print(f"ID: {f.id}, Name: {f.name}")

if __name__ == "__main__":
    asyncio.run(main())
