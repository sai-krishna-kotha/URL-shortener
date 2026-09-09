from fastapi import FastAPI
from app.core.config import settings
from app.api.routes import shorten

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.include_router(shorten.router, prefix=settings.API_V1_STR, tags=["URLs"])

@app.get("/health")
async def health_check():
    return {"status": "ok"}
