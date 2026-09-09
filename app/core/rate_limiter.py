import logging
from fastapi import Request, HTTPException, status, Depends
from redis.asyncio import Redis
from app.db.redis import get_redis_client

logger = logging.getLogger(__name__)

RATE_LIMIT_MAX_REQUESTS = 10
RATE_LIMIT_WINDOW_SECONDS = 60

async def check_rate_limit(request: Request, redis: Redis = Depends(get_redis_client)):
    """
    Fixed-window rate limiter using Redis.
    Limits URL creation to 10 requests per minute per IP address.
    Fails open if Redis is unavailable.
    """
    client_ip = request.client.host if request.client else "127.0.0.1"
    key = f"rate_limit:create_url:{client_ip}"
    
    try:
        current_count = await redis.incr(key)
        
        # If this is the first request in the window, set the expiration
        if current_count == 1:
            await redis.expire(key, RATE_LIMIT_WINDOW_SECONDS)
            
        if current_count > RATE_LIMIT_MAX_REQUESTS:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Try again later."
            )
            
    except HTTPException:
        raise # Reraise the 429 correctly
    except Exception as e:
        # Fail-open behavior: log the Redis error and allow the request to proceed
        logger.warning(f"Rate limiter Redis failure: {str(e)}")
        pass
