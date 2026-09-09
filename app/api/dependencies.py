from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.repository.url_repository import URLRepository
from app.services.url_service import URLService

def get_url_repository(session: AsyncSession = Depends(get_db)) -> URLRepository:
    return URLRepository(session)

def get_url_service(
    repository: URLRepository = Depends(get_url_repository),
    session: AsyncSession = Depends(get_db)
) -> URLService:
    return URLService(repository=repository, session=session)
