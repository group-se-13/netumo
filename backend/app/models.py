from sqlalchemy import Table, Column, Integer, String, DateTime, Boolean, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.sql import func
from .database import metadata

targets = Table(
    "targets",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("url", String, unique=True, nullable=False, index=True),
    Column("name", String, nullable=False),
    Column("created_at", DateTime(timezone=True), server_default=func.now()),
    Column("active", Boolean, default=True),
)


monitoring_results = Table(
    "monitoring_results",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("target_id", Integer, ForeignKey("targets.id"), nullable=False),
    Column("status_code", Integer, nullable=True),
    Column("response_time", Float, nullable=True),
    Column("checked_at", DateTime(timezone=True), server_default=func.now()),
    Column("success", Boolean, nullable=False),
    Column("error", String, nullable=True),
)