import pytest
from httpx import AsyncClient
from app.main import app
from app.core.config import settings
from app.api.dependencies import get_db
from app.models.url import URL

@pytest.fixture
def apply_db_override(db_session):
    async def _override_get_db():
        yield db_session
    app.dependency_overrides[get_db] = _override_get_db
    yield
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_get_url_stats(apply_db_override, db_session):
    test_url = URL(short_code="stats1", target_url="https://example.com", clicks=42)
    db_session.add(test_url)
    await db_session.commit()
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get(f"{settings.API_V1_STR}/urls/stats1/stats")
        
    assert response.status_code == 200
    data = response.json()
    assert data["short_code"] == "stats1"
    assert data["clicks"] == 42
    assert "created_at" in data

@pytest.mark.asyncio
async def test_get_url_stats_not_found(apply_db_override):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get(f"{settings.API_V1_STR}/urls/unknown/stats")
        
    assert response.status_code == 404
