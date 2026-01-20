from app.crud.base import CRUDBase
from app.models.fee_structure import FeeStructure
from app.schemas.fee_structure import FeeStructureCreate, FeeStructureUpdate

class CRUDFeeStructure(CRUDBase[FeeStructure, FeeStructureCreate, FeeStructureUpdate]):
    pass

fee_structure = CRUDFeeStructure(FeeStructure)
