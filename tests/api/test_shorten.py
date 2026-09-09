import pytest
from httpx import AsyncClient
from app.main import app
from app.core.config import settings
from app.api.dependencies import get_db

@pytest.fixture
def apply_db_override(db_session):
    async def _override_get_db():
        yield db_session
    
    app.dependency_overrides[get_db] = _override_get_db
    yield
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_create_url_valid(apply_db_override):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            f"{settings.API_V1_STR}/urls", 
            json={"target_url": "https://example.com/test"}
        )
    assert response.status_code == 201
    data = response.json()
    assert "short_code" in data
    assert data["target_url"] == "https://example.com/test"
    assert data["short_url"] == f"{settings.DOMAIN.rstrip('/')}/{data['short_code']}"
    assert "id" in data
    assert "created_at" in data

@pytest.mark.asyncio
async def test_create_url_custom_alias(apply_db_override):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            f"{settings.API_V1_STR}/urls", 
            json={"target_url": "https://example.com/alias", "custom_alias": "my-alias-123"}
        )
    assert response.status_code == 201
    data = response.json()
    assert data["short_code"] == "my-alias-123"

@pytest.mark.asyncio
async def test_create_url_expiration(apply_db_override):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            f"{settings.API_V1_STR}/urls", 
            json={"target_url": "https://example.com/exp", "expires_at": "2030-01-01T00:00:00Z"}
        )
    assert response.status_code == 201
    data = response.json()
    assert data["expires_at"] == "2030-01-01T00:00:00Z"

@pytest.mark.asyncio
async def test_invalid_target_url_returns_400(apply_db_override):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            f"{settings.API_V1_STR}/urls", 
            json={"target_url": "ftp://bad-scheme.com"}
        )
    assert response.status_code == 400
    assert "HTTP or HTTPS" in response.json()["detail"]

@pytest.mark.asyncio
async def test_invalid_alias_returns_400(apply_db_override):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            f"{settings.API_V1_STR}/urls", 
            json={"target_url": "https://example.com", "custom_alias": "invalid space"}
        )
    assert response.status_code == 400
    assert "Alias must be 3-30 characters" in response.json()["detail"]

@pytest.mark.asyncio
async def test_duplicate_alias_returns_409(apply_db_override):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Create first
        await ac.post(
            f"{settings.API_V1_STR}/urls", 
            json={"target_url": "https://example.com/1", "custom_alias": "taken-alias"}
        )
        # Attempt duplicate
        response = await ac.post(
            f"{settings.API_V1_STR}/urls", 
            json={"target_url": "https://example.com/2", "custom_alias": "taken-alias"}
        )
    assert response.status_code == 409
    assert "already in use" in response.json()["detail"]
