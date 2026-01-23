import asyncio
from app.db.session import engine
from app.models.tuition_invoice import TuitionInvoice
from app.db.base import Base

async def recreate_table():
    async with engine.begin() as conn:
        print("Dropping tuitioninvoice table...")
        await conn.run_sync(TuitionInvoice.__table__.drop, checkfirst=True)
        print("Recreating tuitioninvoice table...")
        await conn.run_sync(TuitionInvoice.__table__.create)
    print("Done.")

if __name__ == "__main__":
    asyncio.run(recreate_table())
