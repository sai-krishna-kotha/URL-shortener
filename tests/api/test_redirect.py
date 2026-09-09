import pytest
from httpx import AsyncClient
from app.main import app
from app.api.dependencies import get_db
from app.models.url import URL
import datetime

@pytest.fixture
def apply_db_override(db_session):
    async def _override_get_db():
        yield db_session
    app.dependency_overrides[get_db] = _override_get_db
    yield
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_redirect_valid_url(apply_db_override, db_session):
    # Setup test data
    test_url = URL(short_code="valid1", target_url="https://example.com/valid")
    db_session.add(test_url)
    await db_session.commit()
    
    async with AsyncClient(app=app, base_url="http://test", follow_redirects=False) as ac:
        response = await ac.get("/valid1")
        
    assert response.status_code == 307
    assert response.headers["location"] == "https://example.com/valid"

@pytest.mark.asyncio
async def test_redirect_not_found(apply_db_override):
    async with AsyncClient(app=app, base_url="http://test", follow_redirects=False) as ac:
        response = await ac.get("/unknown123")
        
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_redirect_expired_url(apply_db_override, db_session):
    past_date = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=1)
    test_url = URL(short_code="exp1", target_url="https://example.com", expires_at=past_date)
    db_session.add(test_url)
    await db_session.commit()
    
    async with AsyncClient(app=app, base_url="http://test", follow_redirects=False) as ac:
        response = await ac.get("/exp1")
        
    assert response.status_code == 410

@pytest.mark.asyncio
async def test_redirect_inactive_url(apply_db_override, db_session):
    test_url = URL(short_code="inact1", target_url="https://example.com", is_active=False)
    db_session.add(test_url)
    await db_session.commit()
    
    async with AsyncClient(app=app, base_url="http://test", follow_redirects=False) as ac:
        response = await ac.get("/inact1")
        
    assert response.status_code == 410
