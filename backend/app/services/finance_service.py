from typing import List, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.student import Student
from app.models.fee_structure import FeeStructure
from app.models.tuition_invoice import TuitionInvoice
from app.models.transaction import Transaction
from app.models.finance_ext import TuitionInstallment
from app.models.marketing import Lead
from app.schemas.tuition_invoice import TuitionInvoiceCreate
from app.crud.crud_tuition_invoice import tuition_invoice as crud_invoice
from app.crud.crud_transaction import transaction as crud_transaction
from app.crud.crud_finance_ext import installment as crud_installment
from datetime import datetime, timedelta
from sqlalchemy import func

class FinanceService:
    @staticmethod
    async def generate_invoices_for_program(db: AsyncSession, program_id: int):
        result = await db.execute(select(FeeStructure).where(FeeStructure.program_id == program_id))
        fee = result.scalars().first()
        if not fee:
            return {"error": "No fee structure found for this program"}
            
        result = await db.execute(select(Student).where(Student.program_id == program_id))
        students = result.scalars().all()
        
        count = 0
        for student in students:
            existing = await db.execute(select(TuitionInvoice).where(
                TuitionInvoice.student_id == student.id,
                TuitionInvoice.fee_structure_id == fee.id,
                TuitionInvoice.status == "unpaid"
            ))
            if existing.scalars().first():
                continue
                
            obj_in = TuitionInvoiceCreate(
                student_id=student.id,
                fee_structure_id=fee.id,
                amount_due=fee.amount,
                due_date=datetime.now() + timedelta(days=30)
            )
            await crud_invoice.create(db, obj_in=obj_in)
            count += 1
            
        return {"message": f"Generated {count} invoices"}

    @staticmethod
    async def record_payment(db: AsyncSession, invoice_id: int, amount: float):
        invoice = await crud_invoice.get(db, id=invoice_id)
        if not invoice:
            return {"error": "Invoice not found"}
            
        invoice.amount_paid += amount
        if invoice.amount_paid >= (invoice.amount_due + invoice.late_fee_accumulated):
            invoice.status = "paid"
        elif invoice.amount_paid > 0:
            invoice.status = "partial"
            
        transaction_data = {
            "description": f"Tuition Payment - Invoice #{invoice.id}",
            "amount": amount,
            "type": "income",
            "category": "tuition"
        }
        await crud_transaction.create(db, obj_in=transaction_data)
        
        await db.commit()
        await db.refresh(invoice)
        return invoice

    @staticmethod
    async def apply_late_fees(db: AsyncSession):
        """Apply a 5% late fee to all overdue unpaid invoices."""
        now = datetime.now()
        result = await db.execute(select(TuitionInvoice).where(
            TuitionInvoice.status != "paid",
            TuitionInvoice.due_date < now
        ))
        overdue_invoices = result.scalars().all()
        
        for invoice in overdue_invoices:
            penalty = invoice.amount_due * 0.05
            invoice.late_fee_accumulated += penalty
            # Only apply once per call or logic can be more complex (e.g. monthly)
            
        await db.commit()
        return {"affected": len(overdue_invoices)}

    @staticmethod
    async def create_installment_plan(db: AsyncSession, invoice_id: int, num_installments: int):
        invoice = await crud_invoice.get(db, id=invoice_id)
        if not invoice:
            return {"error": "Invoice not found"}
            
        installment_amount = invoice.amount_due / num_installments
        for i in range(num_installments):
            due_date = datetime.now() + timedelta(days=30 * (i + 1))
            inst = TuitionInstallment(
                invoice_id=invoice_id,
                amount=installment_amount,
                due_date=due_date,
                status="pending"
            )
            db.add(inst)
            
        await db.commit()
        return {"message": f"Created {num_installments} installments"}

    @staticmethod
    async def get_recruitment_funnel(db: AsyncSession):
        """Get lead counts per recruitment stage."""
        stages = ["new", "contacted", "interested", "applicant", "admitted", "enrolled", "lost"]
        stats = {}
        for stage in stages:
            res = await db.execute(select(func.count(Lead.id)).where(Lead.status == stage))
            stats[stage] = res.scalar()
        return stats

finance_service = FinanceService()
