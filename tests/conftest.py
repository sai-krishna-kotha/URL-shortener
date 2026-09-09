import pytest
import pytest_asyncio
import asyncio
from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession
from app.db.session import engine

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest_asyncio.fixture
async def db_session():
    # Wrap each test in a transaction that rolls back at the end
    connection = await engine.connect()
    transaction = await connection.begin()
    
    SessionLocal = async_sessionmaker(bind=connection, class_=AsyncSession, expire_on_commit=False)
    session = SessionLocal()
    
    yield session
    
    await session.close()
    await transaction.rollback()
    await connection.close()
