from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class MarketingCampaign(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    platform = Column(String) # Facebook, Google, Email, Event
    budget = Column(Float)
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    status = Column(String, default="planned") # planned, active, completed
    
    leads = relationship("Lead", back_populates="campaign")

class Lead(Base):
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, index=True)
    phone = Column(String)
    source = Column(String) # Organic, Campaign, Referral
    campaign_id = Column(Integer, ForeignKey("marketingcampaign.id"), nullable=True)
    status = Column(String, default="new") # new, contacted, interested, applicant, admitted, enrolled, lost
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    campaign = relationship("MarketingCampaign", back_populates="leads")
