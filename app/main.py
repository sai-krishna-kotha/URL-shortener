from fastapi import FastAPI
from app.core.config import settings
from app.api.routes import shorten, redirect, analytics

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

app.include_router(shorten.router, prefix=settings.API_V1_STR, tags=["URLs"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/urls", tags=["Analytics"])
app.include_router(redirect.router, tags=["Redirect"])
