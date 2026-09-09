import pytest
from sqlalchemy.exc import IntegrityError
from app.models.url import URL
from app.repository.url_repository import URLRepository

@pytest.mark.asyncio
async def test_create_url(db_session):
    repo = URLRepository(db_session)
    url = URL(short_code="abcd123", target_url="https://example.com")
    
    created_url = await repo.create(url)
    
    assert created_url.id is not None
    assert created_url.short_code == "abcd123"
    assert created_url.target_url == "https://example.com"
    assert created_url.clicks == 0
    assert created_url.is_active is True

@pytest.mark.asyncio
async def test_unique_short_code_constraint(db_session):
    repo = URLRepository(db_session)
    url1 = URL(short_code="duplicate", target_url="https://example1.com")
    await repo.create(url1)
    
    url2 = URL(short_code="duplicate", target_url="https://example2.com")
    with pytest.raises(IntegrityError):
        await repo.create(url2)

@pytest.mark.asyncio
async def test_get_by_short_code(db_session):
    repo = URLRepository(db_session)
    url = URL(short_code="findme", target_url="https://find.com")
    await repo.create(url)
    
    found_url = await repo.get_by_short_code("findme")
    
    assert found_url is not None
    assert found_url.target_url == "https://find.com"

@pytest.mark.asyncio
async def test_get_by_id(db_session):
    repo = URLRepository(db_session)
    url = URL(short_code="byid", target_url="https://id.com")
    created = await repo.create(url)
    
    found_url = await repo.get_by_id(created.id)
    
    assert found_url is not None
    assert found_url.short_code == "byid"
