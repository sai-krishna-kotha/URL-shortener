from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from sqlalchemy.exc import IntegrityError
from app.models.url import URL

class URLRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, url: URL) -> URL:
        """
        Inserts a new URL record into the database.
        Raises SQLAlchemy IntegrityError if short_code is not unique.
        """
        self.session.add(url)
        await self.session.commit()
        await self.session.refresh(url)
        return url

    async def get_by_short_code(self, short_code: str) -> Optional[URL]:
        """
        Retrieves a URL record by its short_code.
        """
        result = await self.session.execute(select(URL).where(URL.short_code == short_code))
        return result.scalar_one_or_none()

    async def get_by_id(self, url_id: int) -> Optional[URL]:
        """
        Retrieves a URL record by its internal database ID.
        """
        result = await self.session.execute(select(URL).where(URL.id == url_id))
        return result.scalar_one_or_none()

    async def update(self, url: URL) -> URL:
        """
        Updates an existing URL record (e.g., modifying is_active or clicks).
        """
        await self.session.commit()
        await self.session.refresh(url)
        return url

    async def increment_clicks(self, short_code: str) -> None:
        """
        Atomically increments the click counter for a short code.
        """
        stmt = update(URL).where(URL.short_code == short_code).values(clicks=URL.clicks + 1)
        await self.session.execute(stmt)
        await self.session.commit()
