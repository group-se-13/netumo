from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from .models import monitoring_results
from .database import database

router = APIRouter()

class MonitoringResult(BaseModel):
    id: int
    target_id: int
    status_code: Optional[int]
    response_time: Optional[float]
    checked_at: str  # you can use datetime if you want
    success: bool
    error: Optional[str]

    model_config = {
        "from_attributes": True
    }

@router.get("/", response_model=List[MonitoringResult])
async def get_monitoring_results(
    target_id: Optional[int] = Query(None, description="Filter by target ID"),
    limit: int = Query(50, description="Limit number of results")
):
    query = monitoring_results.select().order_by(monitoring_results.c.checked_at.desc()).limit(limit)
    if target_id:
        query = query.where(monitoring_results.c.target_id == target_id)

    results = await database.fetch_all(query)
    if not results:
        raise HTTPException(status_code=404, detail="No monitoring results found")
    return results
