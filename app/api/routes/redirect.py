from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from app.services.url_service import URLService
from app.api.dependencies import get_url_service
from app.core.exceptions import URLNotFound, URLExpired, URLInactive

router = APIRouter()

@router.get(
    "/{short_code}",
    response_class=RedirectResponse,
    status_code=status.HTTP_307_TEMPORARY_REDIRECT,
    summary="Redirect to original URL",
    description="Takes a short code and redirects to the original target URL. Increments click tracking.",
    responses={
        404: {"description": "URL not found"},
        410: {"description": "URL expired or inactive"}
    }
)
async def redirect_url(
    short_code: str,
    url_service: URLService = Depends(get_url_service)
):
    try:
        target_url = await url_service.get_url_for_redirect(short_code)
        return RedirectResponse(url=target_url, status_code=status.HTTP_307_TEMPORARY_REDIRECT)
    except URLNotFound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="URL not found")
    except (URLExpired, URLInactive):
        raise HTTPException(status_code=status.HTTP_410_GONE, detail="URL is no longer available")
