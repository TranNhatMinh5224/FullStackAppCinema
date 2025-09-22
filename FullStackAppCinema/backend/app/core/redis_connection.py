import os
import asyncio

# Thử import redis async modern, fallback về aioredis nếu cần
try:
    import redis.asyncio as redis_async
except Exception:
    import aioredis as redis_async

_redis = None

async def get_redis():
    """Return a singleton async Redis client. Handles both redis.asyncio and aioredis APIs."""
    global _redis
    if _redis is None:
        url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        # from_url có thể là coroutine trong một số phiên bản aioredis
        client = redis_async.from_url(url, decode_responses=True)
        if asyncio.iscoroutine(client):
            _redis = await client
        else:
            _redis = client
    return _redis