import os
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import engine, Base, AsyncSessionLocal
from app.db.seed import seed_initial_data
from app.api.v1.endpoints import (
    health,
    auth,
    prices,
    lots,
    recyclers,
    handovers,
    ledger,
    ml_endpoints
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables if not exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables synchronized.")

    # Seed demo evaluation data
    async with AsyncSessionLocal() as session:
        try:
            await seed_initial_data(session)
            print("Default CPCB e-waste demo dataset seeded.")
        except Exception as e:
            print("Seed notice:", e)

    yield

    # Shutdown
    await engine.dispose()
    print("Database engine disposed.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Smart India Hackathon 2026 (PS 26229) - Informal to Formal E-Waste Bridge API",
    openapi_url="/api/v1/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(health.router)
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(prices.router, prefix=settings.API_V1_STR)
app.include_router(lots.router, prefix=settings.API_V1_STR)
app.include_router(recyclers.router, prefix=settings.API_V1_STR)
app.include_router(handovers.router, prefix=settings.API_V1_STR)
app.include_router(ledger.router, prefix=settings.API_V1_STR)
app.include_router(ml_endpoints.router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
