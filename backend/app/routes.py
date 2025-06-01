from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel, HttpUrl

from .models import targets  # SQLAlchemy table
from .database import database  # Database connection

router = APIRouter()

# Pydantic schemas
class TargetBase(BaseModel):
    url: HttpUrl
    name: str

class TargetCreate(TargetBase):
    pass

class Target(TargetBase):
    id: int
    active: bool

    model_config = {
        "from_attributes": True
    }


# Routes
@router.post("/", response_model=Target)
async def create_target(target: TargetCreate):
    query = targets.insert().values(url=str(target.url), name=target.name, active=True)
    record_id = await database.execute(query)
    return {**target.dict(), "id": record_id, "active": True}

@router.get("/", response_model=List[Target])
async def read_targets():
    query = targets.select()
    return await database.fetch_all(query)

@router.get("/{target_id}", response_model=Target)
async def read_target(target_id: int):
    query = targets.select().where(targets.c.id == target_id)
    result = await database.fetch_one(query)
    if not result:
        raise HTTPException(status_code=404, detail="Target not found")
    return result
