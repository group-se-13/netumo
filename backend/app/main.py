from fastapi import FastAPI
from contextlib import asynccontextmanager

from .database import database, metadata, engine
from .models import targets
from .routes import router as targets_router
from .monitoring_results import router as results_router  # 👈 Import from same directory

@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    metadata.create_all(bind=engine)
    yield
    await database.disconnect()

app = FastAPI(lifespan=lifespan)

app.include_router(targets_router, prefix="/targets", tags=["Monitoring Targets"])
app.include_router(results_router, prefix="/results", tags=["Monitoring Results"])  # 👈 Register results route

@app.get("/")
async def root():
    return {"message": "Mini-Netumo backend running."}
