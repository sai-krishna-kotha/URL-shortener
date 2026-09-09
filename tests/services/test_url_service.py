import pytest
from unittest.mock import AsyncMock
from sqlalchemy.exc import IntegrityError

from app.services.url_service import URLService
from app.repository.url_repository import URLRepository
from app.core.exceptions import InvalidURL, InvalidAlias, AliasAlreadyExists, ShortCodeGenerationError
from app.models.url import URL

@pytest.fixture
def mock_repo():
    return AsyncMock(spec=URLRepository)

@pytest.fixture
def mock_session():
    return AsyncMock()

@pytest.fixture
def mock_redis():
    redis = AsyncMock()
    redis.get.return_value = None
    return redis

@pytest.fixture
def url_service(mock_repo, mock_session, mock_redis):
    return URLService(repository=mock_repo, session=mock_session, redis=mock_redis)

@pytest.mark.asyncio
async def test_valid_http_url_accepted(url_service, mock_repo):
    mock_repo.create.return_value = URL(short_code="1234567", target_url="http://example.com")
    result = await url_service.create_short_url("http://example.com")
    assert result.target_url == "http://example.com"
    mock_repo.create.assert_called_once()

@pytest.mark.asyncio
async def test_valid_https_url_accepted(url_service, mock_repo):
    mock_repo.create.return_value = URL(short_code="1234567", target_url="https://example.com")
    result = await url_service.create_short_url("https://example.com")
    assert result.target_url == "https://example.com"

@pytest.mark.asyncio
async def test_invalid_url_rejected(url_service):
    with pytest.raises(InvalidURL, match="must use HTTP or HTTPS scheme"):
        await url_service.create_short_url("ftp://example.com")

@pytest.mark.asyncio
async def test_malformed_url_rejected(url_service):
    with pytest.raises(InvalidURL, match="URL is malformed"):
        await url_service.create_short_url("http:///example")

@pytest.mark.asyncio
async def test_empty_url_rejected(url_service):
    with pytest.raises(InvalidURL, match="URL cannot be empty"):
        await url_service.create_short_url("")

@pytest.mark.asyncio
async def test_valid_custom_alias_accepted(url_service, mock_repo):
    mock_repo.create.return_value = URL(short_code="my-alias", target_url="https://example.com")
    result = await url_service.create_short_url("https://example.com", custom_alias="my-alias")
    assert result.short_code == "my-alias"

@pytest.mark.asyncio
async def test_invalid_custom_alias_rejected(url_service):
    with pytest.raises(InvalidAlias):
        await url_service.create_short_url("https://example.com", custom_alias="my alias!")

@pytest.mark.asyncio
async def test_custom_alias_collision(url_service, mock_repo, mock_session):
    mock_repo.create.side_effect = IntegrityError("mock", "mock", "mock")
    with pytest.raises(AliasAlreadyExists):
        await url_service.create_short_url("https://example.com", custom_alias="taken")
    mock_session.rollback.assert_called_once()

@pytest.mark.asyncio
async def test_generated_code_collision_retry(url_service, mock_repo, mock_session):
    # First call fails, second call succeeds
    mock_repo.create.side_effect = [
        IntegrityError("mock", "mock", "mock"),
        URL(short_code="1234567", target_url="https://example.com")
    ]
    result = await url_service.create_short_url("https://example.com")
    
    assert mock_repo.create.call_count == 2
    assert mock_session.rollback.call_count == 1
    assert result.target_url == "https://example.com"

@pytest.mark.asyncio
async def test_generated_code_repeated_collisions(url_service, mock_repo, mock_session):
    # Fails every time
    mock_repo.create.side_effect = IntegrityError("mock", "mock", "mock")
    
    with pytest.raises(ShortCodeGenerationError):
        await url_service.create_short_url("https://example.com")
        
    assert mock_repo.create.call_count == 5  # MAX_RETRIES
    assert mock_session.rollback.call_count == 5
