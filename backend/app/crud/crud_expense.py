from app.crud.base import CRUDBase
from app.models.expense import ExpenseApproval
from app.schemas.expense import ExpenseApprovalCreate, ExpenseApprovalUpdate

class CRUDExpenseApproval(CRUDBase[ExpenseApproval, ExpenseApprovalCreate, ExpenseApprovalUpdate]):
    pass

expense_approval = CRUDExpenseApproval(ExpenseApproval)
