from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.url import URLCreateRequest, URLResponse
from app.services.url_service import URLService
from app.api.dependencies import get_url_service
from app.core.exceptions import InvalidURL, InvalidAlias, AliasAlreadyExists, ShortCodeGenerationError
from app.core.config import settings

router = APIRouter()

@router.post(
    "/urls",
    response_model=URLResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a shortened URL",
    description="Submits a target URL and returns a unique short URL. Supports custom aliases and expiration.",
    responses={
        400: {"description": "Invalid URL or Alias format"},
        409: {"description": "Custom alias already exists"},
        500: {"description": "Failed to generate short code"}
    }
)
async def create_url(
    request: URLCreateRequest,
    url_service: URLService = Depends(get_url_service)
):
    try:
        created_url = await url_service.create_short_url(
            target_url=request.target_url,
            custom_alias=request.custom_alias,
            expires_at=request.expires_at
        )
        
        short_url = f"{settings.DOMAIN.rstrip('/')}/{created_url.short_code}"
        
        return URLResponse(
            id=created_url.id,
            short_code=created_url.short_code,
            target_url=created_url.target_url,
            created_at=created_url.created_at,
            expires_at=created_url.expires_at,
            clicks=created_url.clicks,
            is_active=created_url.is_active,
            short_url=short_url
        )
    except (InvalidURL, InvalidAlias) as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except AliasAlreadyExists as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except ShortCodeGenerationError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
