import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock
from app.main import app
from app.core.config import settings
from app.db.redis import get_redis_client
from app.api.dependencies import get_db

@pytest.fixture
def apply_db_override(db_session):
    async def _override_get_db():
        yield db_session
    app.dependency_overrides[get_db] = _override_get_db
    yield
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_rate_limiter_allows_under_limit(apply_db_override):
    # clear redis for this IP first
    async for redis in get_redis_client():
        await redis.delete("rate_limit:create_url:127.0.0.1")
        
    async with AsyncClient(app=app, base_url="http://test") as ac:
        for _ in range(10):
            response = await ac.post(
                f"{settings.API_V1_STR}/urls", 
                json={"target_url": "https://example.com/rate1"}
            )
            assert response.status_code == 201

@pytest.mark.asyncio
async def test_rate_limiter_blocks_over_limit(apply_db_override):
    # clear redis
    async for redis in get_redis_client():
        await redis.delete("rate_limit:create_url:127.0.0.1")
        
    async with AsyncClient(app=app, base_url="http://test") as ac:
        for _ in range(10):
            await ac.post(
                f"{settings.API_V1_STR}/urls", 
                json={"target_url": "https://example.com/rate2"}
            )
        # 11th request should fail
        response = await ac.post(
            f"{settings.API_V1_STR}/urls", 
            json={"target_url": "https://example.com/rate2"}
        )
        assert response.status_code == 429

@pytest.mark.asyncio
async def test_rate_limiter_fail_open(apply_db_override):
    mock_redis = AsyncMock()
    mock_redis.incr.side_effect = Exception("Redis is down")
    
    async def override_redis():
        yield mock_redis
        
    app.dependency_overrides[get_redis_client] = override_redis
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            f"{settings.API_V1_STR}/urls", 
            json={"target_url": "https://example.com/failopen"}
        )
        assert response.status_code == 201 # should succeed
    app.dependency_overrides.clear()
