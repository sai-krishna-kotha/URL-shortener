from redis.asyncio import Redis, ConnectionPool
from app.core.config import settings

# Global connection pool to be reused across requests
redis_pool = ConnectionPool.from_url(settings.REDIS_URL, decode_responses=True)

async def get_redis_client() -> Redis:
    """
    Dependency that provides an async Redis client from the pool.
    """
    client = Redis(connection_pool=redis_pool)
    try:
        yield client
    finally:
        await client.close()
