import re
from urllib.parse import urlparse
from typing import Optional
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import InvalidURL, InvalidAlias, AliasAlreadyExists, ShortCodeGenerationError
from app.models.url import URL
from app.repository.url_repository import URLRepository
from app.utils.encoder import generate_short_code

MAX_RETRIES = 5
ALIAS_REGEX = re.compile(r"^[a-zA-Z0-9_-]{3,30}$")

class URLService:
    def __init__(self, repository: URLRepository, session: AsyncSession):
        self.repository = repository
        self.session = session

    def validate_target_url(self, target_url: str) -> None:
        if not target_url:
            raise InvalidURL("URL cannot be empty")
        if len(target_url) > 2048:
            raise InvalidURL("URL exceeds maximum length of 2048 characters")
        
        try:
            parsed = urlparse(target_url)
            if parsed.scheme not in ("http", "https"):
                raise InvalidURL("URL must use HTTP or HTTPS scheme")
            if not parsed.netloc:
                raise InvalidURL("URL is malformed")
        except InvalidURL:
            raise
        except Exception:
            raise InvalidURL("URL is malformed")

    def validate_alias(self, alias: str) -> None:
        if not alias:
            raise InvalidAlias("Alias cannot be empty")
        if not ALIAS_REGEX.match(alias):
            raise InvalidAlias("Alias must be 3-30 characters long and contain only letters, numbers, hyphens, and underscores")

    async def create_short_url(self, target_url: str, custom_alias: Optional[str] = None) -> URL:
        self.validate_target_url(target_url)

        if custom_alias is not None:
            self.validate_alias(custom_alias)
            url_record = URL(short_code=custom_alias, target_url=target_url)
            try:
                return await self.repository.create(url_record)
            except IntegrityError:
                await self.session.rollback()
                raise AliasAlreadyExists(f"The alias '{custom_alias}' is already in use.")
        else:
            for _ in range(MAX_RETRIES):
                short_code = generate_short_code()
                url_record = URL(short_code=short_code, target_url=target_url)
                try:
                    return await self.repository.create(url_record)
                except IntegrityError:
                    await self.session.rollback()
                    continue
            
            raise ShortCodeGenerationError("Failed to generate a unique short code after multiple attempts.")
