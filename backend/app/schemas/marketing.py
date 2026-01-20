from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

# Campaign Schemas
class MarketingCampaignBase(BaseModel):
    name: Optional[str] = None
    platform: Optional[str] = None
    budget: Optional[float] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = "planned"

class MarketingCampaignCreate(MarketingCampaignBase):
    name: str

class MarketingCampaignUpdate(MarketingCampaignBase):
    pass

class MarketingCampaignInDBBase(MarketingCampaignBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True

class MarketingCampaign(MarketingCampaignInDBBase):
    pass

# Lead Schemas
class LeadBase(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = "Organic"
    campaign_id: Optional[int] = None
    status: Optional[str] = "new" # new, contacted, interested, applicant, admitted, enrolled, lost

class LeadCreate(LeadBase):
    full_name: str
    email: str

class LeadUpdate(LeadBase):
    pass

class LeadInDBBase(LeadBase):
    id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Lead(LeadInDBBase):
    pass
