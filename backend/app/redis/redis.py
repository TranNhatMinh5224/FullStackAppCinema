import redis.asyncio as redis

class RedisManager:
    def __init__(self, redis_url="redis://localhost:6379"):
    # def __init__(self, redis_url="redis://default:XNOrDwnmoV8ZwQ0zty9UINOn5cNGgNPx@redis-13952.c228.us-central1-1.gce.redns.redis-cloud.com:13952"):
        # Kết nối với Redis qua URL
        self.redis = redis.from_url(redis_url, decode_responses=True)

    async def set_ghe_tam_thoi(self, suat_chieu_id, ghe_id, user_id, timeout=300):
        key = f"ghe:{ghe_id}:{suat_chieu_id}"
        if await self.redis.exists(key):
            return False
        await self.redis.setex(key, timeout, user_id)
        return True

    async def kiem_tra_ghe(self, suat_chieu_id, ghe_id):
        key = f"ghe:{ghe_id}:{suat_chieu_id}"
        return await self.redis.exists(key)

    async def get_user_giu_ghe(self, suat_chieu_id, ghe_id):
        key = f"ghe:{ghe_id}:{suat_chieu_id}"
        user_id = await self.redis.get(key)
        return int(user_id) if user_id else None

    async def xoa_ghe_tam_thoi(self, suat_chieu_id, ghe_id):
        key = f"ghe:{ghe_id}:{suat_chieu_id}"
        await self.redis.delete(key)

    async def xoa_ghe_cua_user(self, suat_chieu_id, user_id):
        pattern = f"ghe:*:{suat_chieu_id}"
        keys = await self.redis.keys(pattern)
        ghe_ids_da_xoa = []
        for key in keys:
            current_user = await self.redis.get(key)
            if current_user == str(user_id):
                parts = key.split(":")
                if len(parts) >= 2:
                    try:
                        ghe_id = int(parts[1])
                        ghe_ids_da_xoa.append(ghe_id)
                    except ValueError:
                        pass
                await self.redis.delete(key)
        return ghe_ids_da_xoa
    

    async def close(self):
        await self.redis.close()
redis_manager = RedisManager()

