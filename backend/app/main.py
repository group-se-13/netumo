                                                                                                                                                                   
from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from .database import database, metadata, engine
from .routes import router as targets_router
from .monitoring_results import router as results_router  # MAKE SURE this exists and is imported correctly

@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    metadata.create_all(bind=engine)
    yield
    await database.disconnect()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(targets_router, prefix="/api/targets", tags=["Monitoring Targets"])
app.include_router(results_router, prefix="/api/results", tags=["Monitoring Results"])

@app.get("/")
async def root():
    return {"message": "Mini-Netumo backend running."}