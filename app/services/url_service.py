import re
import json
from datetime import datetime, timezone
from urllib.parse import urlparse
from typing import Optional
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from redis.asyncio import Redis

from app.core.exceptions import InvalidURL, InvalidAlias, AliasAlreadyExists, ShortCodeGenerationError, URLNotFound, URLExpired, URLInactive
from app.models.url import URL
from app.repository.url_repository import URLRepository
from app.utils.encoder import generate_short_code

MAX_RETRIES = 5
ALIAS_REGEX = re.compile(r"^[a-zA-Z0-9_-]{3,30}$")
DEFAULT_CACHE_TTL = 86400  # 24 hours in seconds

class URLService:
    def __init__(self, repository: URLRepository, session: AsyncSession, redis: Redis):
        self.repository = repository
        self.session = session
        self.redis = redis

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

    async def create_short_url(self, target_url: str, custom_alias: Optional[str] = None, expires_at: Optional[datetime] = None) -> URL:
        self.validate_target_url(target_url)

        if custom_alias is not None:
            self.validate_alias(custom_alias)
            url_record = URL(short_code=custom_alias, target_url=target_url, expires_at=expires_at)
            try:
                return await self.repository.create(url_record)
            except IntegrityError:
                await self.session.rollback()
                raise AliasAlreadyExists(f"The alias '{custom_alias}' is already in use.")
        else:
            for _ in range(MAX_RETRIES):
                short_code = generate_short_code()
                url_record = URL(short_code=short_code, target_url=target_url, expires_at=expires_at)
                try:
                    return await self.repository.create(url_record)
                except IntegrityError:
                    await self.session.rollback()
                    continue
            
            raise ShortCodeGenerationError("Failed to generate a unique short code after multiple attempts.")

    async def get_url_for_redirect(self, short_code: str) -> str:
        """
        Retrieves the target URL for a given short code using a Cache-Aside strategy.
        Validates lifecycle (active, expired) and atomically increments clicks.
        """
        cache_key = f"url:{short_code}"
        cached_data_str = None
        
        # 1. Check Redis
        try:
            cached_data_str = await self.redis.get(cache_key)
        except Exception:
            # Fallback to DB if Redis fails
            cached_data_str = None

        url_data = None
        if cached_data_str:
            url_data = json.loads(cached_data_str)
        else:
            # 2. Check DB
            url_obj = await self.repository.get_by_short_code(short_code)
            if not url_obj:
                raise URLNotFound(f"URL with code {short_code} not found")
            
            url_data = {
                "target_url": url_obj.target_url,
                "is_active": url_obj.is_active,
                "expires_at": url_obj.expires_at.isoformat() if url_obj.expires_at else None
            }

        # 3. Validate lifecycle
        if not url_data["is_active"]:
            raise URLInactive("This URL has been deactivated")
            
        if url_data["expires_at"]:
            expires_at_dt = datetime.fromisoformat(url_data["expires_at"])
            if datetime.now(timezone.utc) > expires_at_dt:
                raise URLExpired("This URL has expired")

        # 4. Cache if it was a miss (and DB lookup succeeded)
        if not cached_data_str:
            try:
                ttl = DEFAULT_CACHE_TTL
                if url_data["expires_at"]:
                    expires_at_dt = datetime.fromisoformat(url_data["expires_at"])
                    remaining = int((expires_at_dt - datetime.now(timezone.utc)).total_seconds())
                    ttl = min(ttl, remaining)
                
                if ttl > 0:
                    await self.redis.setex(cache_key, ttl, json.dumps(url_data))
            except Exception:
                # Ignore cache write failures to ensure redirect succeeds
                pass

        # 5. Increment clicks atomically
        await self.repository.increment_clicks(short_code)
        
        return url_data["target_url"]

    async def get_url_stats(self, short_code: str) -> URL:
        """
        Retrieves URL statistics directly from the database.
        Returns the URL model if found, otherwise raises URLNotFound.
        """
        url_obj = await self.repository.get_by_short_code(short_code)
        if not url_obj:
            raise URLNotFound(f"URL with code {short_code} not found")
        return url_obj
