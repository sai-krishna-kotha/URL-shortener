from app.models.base import Base
from app.models.url import URL

# This exposes the models so Alembic can find them easily.
__all__ = ["Base", "URL"]
