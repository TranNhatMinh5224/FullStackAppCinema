from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config import DATABASE_URL


# Tạo engine cho Async
engine = create_async_engine(DATABASE_URL, echo=True)

# Tạo session factory
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

# Base cho ORM models
class Base(DeclarativeBase):
    pass

# Dependency để lấy session
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
