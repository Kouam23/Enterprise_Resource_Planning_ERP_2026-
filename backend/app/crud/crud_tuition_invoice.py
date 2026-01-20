from app.crud.base import CRUDBase
from app.models.tuition_invoice import TuitionInvoice
from app.schemas.tuition_invoice import TuitionInvoiceCreate, TuitionInvoiceUpdate

class CRUDTuitionInvoice(CRUDBase[TuitionInvoice, TuitionInvoiceCreate, TuitionInvoiceUpdate]):
    pass

tuition_invoice = CRUDTuitionInvoice(TuitionInvoice)
