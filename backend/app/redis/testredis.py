import asyncio
import redis.asyncio as redis

async def test_redis():
    try:
        r = redis.from_url("redis://default:YOUR_PASSWORD@YOUR_HOST:PORT", decode_responses=True)
        await r.set("test", "OK")
        val = await r.get("test")
        print("Redis hoạt động:", val)
    except Exception as e:
        print("Lỗi kết nối Redis:", e)

asyncio.run(test_redis())
