from typing import Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.api import deps
from app.models.audit_log import AuditLog
from app.schemas.audit_log import AuditLog as AuditLogSchema

router = APIRouter()

@router.get("/logs", response_model=List[AuditLogSchema])
async def read_audit_logs(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    target_table: Optional[str] = None,
    current_user: Any = Depends(deps.RoleChecker(["Super Admin"]))
) -> Any:
    query = select(AuditLog)
    if target_table:
        query = query.where(AuditLog.target_table == target_table)
    
    result = await db.execute(query.order_by(AuditLog.timestamp.desc()).offset(skip).limit(limit))
    return result.scalars().all()
