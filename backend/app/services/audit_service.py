from typing import Any, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.audit_log import AuditLog

class AuditService:
    @staticmethod
    async def log_action(
        db: AsyncSession,
        *,
        user_id: Optional[int] = None,
        action: str,
        target_table: str,
        target_id: Optional[int] = None,
        changes: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None
    ) -> AuditLog:
        obj = AuditLog(
            user_id=user_id,
            action=action,
            target_table=target_table,
            target_id=target_id,
            changes=changes,
            ip_address=ip_address
        )
        db.add(obj)
        await db.commit()
        await db.refresh(obj)
        return obj

audit_service = AuditService()
