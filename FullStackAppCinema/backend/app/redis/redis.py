import redis.asyncio as redis

class RedisManager:
    def __init__(self, redis_url="redis://localhost:6379"):
        # Kết nối với Redis qua URL
        self.redis = redis.from_url(redis_url, decode_responses=True)

    async def set_ghe_tam_thoi(self, suat_chieu_id, ghe_id, user_id, timeout=60):
        # New key pattern: seat:{schedule_id}:{seat_id}
        key = f"seat:{suat_chieu_id}:{ghe_id}"
        if await self.redis.exists(key):
            return False
        await self.redis.setex(key, timeout, user_id)
        return True

    async def kiem_tra_ghe(self, suat_chieu_id, ghe_id):
        key = f"seat:{suat_chieu_id}:{ghe_id}"
        return await self.redis.exists(key)

    async def get_user_giu_ghe(self, suat_chieu_id, ghe_id):
        key = f"seat:{suat_chieu_id}:{ghe_id}"
        user_id = await self.redis.get(key)
        return int(user_id) if user_id else None

    async def xoa_ghe_tam_thoi(self, suat_chieu_id, ghe_id):
        key = f"seat:{suat_chieu_id}:{ghe_id}"
        await self.redis.delete(key)

    async def xoa_ghe_cua_user(self, suat_chieu_id, user_id):
        """Delete all temporary seats held by user_id for the given suat_chieu_id.
        Returns list of deleted seat ids (as ints when possible).
        """
        pattern = f"seat:{suat_chieu_id}:*"
        keys = await self.redis.keys(pattern)
        removed = []
        for key in keys:
            try:
                current_user = await self.redis.get(key)
                if current_user == str(user_id):
                    # key format: seat:{schedule_id}:{seat_id}
                    parts = key.split(":")
                    if len(parts) >= 3:
                        seat_id = parts[2]
                    else:
                        seat_id = None
                    await self.redis.delete(key)
                    if seat_id is not None:
                        try:
                            removed.append(int(seat_id))
                        except Exception:
                            removed.append(seat_id)
            except Exception:
                continue
        return removed

    async def set_otp(self, email: str, otp: str, timeout: int = 300):  # 300 giây = 5 phút
        key = f"otp:{email}"
        await self.redis.setex(key, timeout, otp)

    async def get_otp(self, email: str):
        key = f"otp:{email}"
        return await self.redis.get(key)

    async def delete_otp(self, email: str):
        key = f"otp:{email}"
        await self.redis.delete(key)

    async def get_otp_attempts(self, email: str):
        key = f"otp_attempts:{email}"
        attempts = await self.redis.get(key)
        return int(attempts) if attempts else 0

    async def increment_otp_attempts(self, email: str):
        key = f"otp_attempts:{email}"
        attempts = await self.redis.incr(key)
        # Set timeout 15 phút cho counter
        await self.redis.expire(key, 900)  # 900 giây = 15 phút
        return attempts

    async def reset_otp_attempts(self, email: str):
        key = f"otp_attempts:{email}"
        await self.redis.delete(key)

    async def set_otp_verified(self, email: str, timeout: int = 600):  # 10 phút để đặt lại mật khẩu
        key = f"otp_verified:{email}"
        await self.redis.setex(key, timeout, "true")

    async def is_otp_verified(self, email: str):
        key = f"otp_verified:{email}"
        return await self.redis.exists(key)

    async def delete_otp_verified(self, email: str):
        key = f"otp_verified:{email}"
        await self.redis.delete(key)

    async def close(self):
        await self.redis.close()

redis_manager = RedisManager()

