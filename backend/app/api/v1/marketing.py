from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud.crud_marketing import marketing_campaign as crud_campaign, lead as crud_lead
from app.schemas.marketing import (
    MarketingCampaign, MarketingCampaignCreate, MarketingCampaignUpdate,
    Lead, LeadCreate, LeadUpdate
)

router = APIRouter()

# Campaigns
@router.get("/campaigns", response_model=List[MarketingCampaign])
async def read_campaigns(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    return await crud_campaign.get_multi(db, skip=skip, limit=limit)

@router.post("/campaigns", response_model=MarketingCampaign)
async def create_campaign(
    *,
    db: AsyncSession = Depends(deps.get_db),
    campaign_in: MarketingCampaignCreate,
) -> Any:
    return await crud_campaign.create(db, obj_in=campaign_in)

# Leads
@router.get("/leads", response_model=List[Lead])
async def read_leads(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    return await crud_lead.get_multi(db, skip=skip, limit=limit)

@router.post("/leads", response_model=Lead)
async def create_lead(
    *,
    db: AsyncSession = Depends(deps.get_db),
    lead_in: LeadCreate,
) -> Any:
    return await crud_lead.create(db, obj_in=lead_in)

@router.patch("/leads/{id}/convert", response_model=Lead)
async def convert_lead(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    db_obj = await crud_lead.get(db, id=id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Lead not found")
    return await crud_lead.update(db, db_obj=db_obj, obj_in={"status": "converted"})
