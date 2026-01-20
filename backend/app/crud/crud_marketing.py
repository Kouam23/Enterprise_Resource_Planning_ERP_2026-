from app.crud.base import CRUDBase
from app.models.marketing import MarketingCampaign, Lead
from app.schemas.marketing import MarketingCampaignCreate, MarketingCampaignUpdate, LeadCreate, LeadUpdate

class CRUDMarketingCampaign(CRUDBase[MarketingCampaign, MarketingCampaignCreate, MarketingCampaignUpdate]):
    pass

class CRUDLead(CRUDBase[Lead, LeadCreate, LeadUpdate]):
    pass

marketing_campaign = CRUDMarketingCampaign(MarketingCampaign)
lead = CRUDLead(Lead)
