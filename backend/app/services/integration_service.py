import hashlib
from typing import Any, Dict, List
from datetime import datetime, timedelta

class IntegrationService:
    @staticmethod
    async def sync_calendar(user_id: int, provider: str = "google") -> Dict[str, Any]:
        """
        Simulate syncing with external calendar providers.
        """
        return {
            "status": "success",
            "provider": provider,
            "synced_events": 12,
            "last_sync": datetime.now().isoformat(),
            "conflicts": 0
        }

    @staticmethod
    async def generate_meeting_link(topic: str, duration_mins: int = 40) -> Dict[str, Any]:
        """
        Simulate generation of Zoom/Meet links.
        """
        meeting_id = hashlib.md5(topic.encode()).hexdigest()[:10]
        return {
            "link": f"https://zoom.us/j/{meeting_id}",
            "topic": topic,
            "password": "ERP-" + meeting_id[:4].upper(),
            "expires_at": (datetime.now() + timedelta(minutes=duration_mins)).isoformat()
        }

integration_service = IntegrationService()
