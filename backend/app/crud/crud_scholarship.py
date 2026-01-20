from app.crud.base import CRUDBase
from app.models.scholarship import Scholarship
from app.schemas.scholarship import ScholarshipCreate, ScholarshipUpdate

class CRUDScholarship(CRUDBase[Scholarship, ScholarshipCreate, ScholarshipUpdate]):
    pass

scholarship = CRUDScholarship(Scholarship)
