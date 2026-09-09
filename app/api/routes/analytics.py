from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.url import URLResponse
from app.services.url_service import URLService
from app.api.dependencies import get_url_service
from app.core.exceptions import URLNotFound
from app.core.config import settings

router = APIRouter()

@router.get(
    "/{short_code}/stats",
    response_model=URLResponse,
    summary="Get URL statistics",
    description="Returns lifecycle and click statistics for a short URL. Currently public."
)
async def get_url_stats(
    short_code: str,
    url_service: URLService = Depends(get_url_service)
):
    try:
        url_obj = await url_service.get_url_stats(short_code)
        
        short_url = f"{settings.DOMAIN.rstrip('/')}/{url_obj.short_code}"
        
        return URLResponse(
            id=url_obj.id,
            short_code=url_obj.short_code,
            target_url=url_obj.target_url,
            created_at=url_obj.created_at,
            expires_at=url_obj.expires_at,
            clicks=url_obj.clicks,
            is_active=url_obj.is_active,
            short_url=short_url
        )
    except URLNotFound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="URL not found")
