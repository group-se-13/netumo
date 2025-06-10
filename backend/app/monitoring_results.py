from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime  # Import datetime
from .models import monitoring_results
from .database import database

router = APIRouter()

class MonitoringResult(BaseModel):
    id: int
    target_id: int
    status_code: Optional[int]
    response_time: Optional[float]
    checked_at: datetime  # Changed from str to datetime
    success: bool
    error: Optional[str]

    model_config = {"from_attributes": True}

@router.get("/", response_model=List[MonitoringResult])
async def get_monitoring_results(
    target_id: Optional[int] = Query(None),
    limit: int = Query(50),
    offset: int = Query(0)
):
    query = monitoring_results.select().order_by(
        monitoring_results.c.checked_at.desc()
    ).limit(limit).offset(offset)

    if target_id:
        query = query.where(monitoring_results.c.target_id == target_id)

    results = await database.fetch_all(query)
    return results