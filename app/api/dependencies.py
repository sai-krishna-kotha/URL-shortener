from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from redis.asyncio import Redis

from app.db.session import get_db
from app.db.redis import get_redis_client
from app.repository.url_repository import URLRepository
from app.services.url_service import URLService

def get_url_repository(session: AsyncSession = Depends(get_db)) -> URLRepository:
    return URLRepository(session)

def get_url_service(
    repository: URLRepository = Depends(get_url_repository),
    session: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis_client)
) -> URLService:
    return URLService(repository=repository, session=session, redis=redis)
