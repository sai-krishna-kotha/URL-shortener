from fastapi import FastAPI
from app.core.config import settings
from app.api.routes import shorten, redirect, analytics

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.include_router(shorten.router, prefix=settings.API_V1_STR, tags=["URLs"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/urls", tags=["Analytics"])
app.include_router(redirect.router, tags=["Redirect"])

@app.get("/health")
async def health_check():
    return {"status": "ok"}
