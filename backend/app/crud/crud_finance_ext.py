from app.crud.base import CRUDBase
from app.models.finance_ext import TuitionInstallment, Vendor
from app.schemas.finance_ext import (
    TuitionInstallmentCreate, TuitionInstallmentUpdate,
    VendorCreate, VendorUpdate
)

class CRUDVendor(CRUDBase[Vendor, VendorCreate, VendorUpdate]):
    pass

class CRUDInstallment(CRUDBase[TuitionInstallment, TuitionInstallmentCreate, TuitionInstallmentUpdate]):
    pass

vendor = CRUDVendor(Vendor)
installment = CRUDInstallment(TuitionInstallment)
