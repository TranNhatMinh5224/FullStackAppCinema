import aioredis  #aioredis là 1 thư viện hỗ trợ connect bất đồng bộ (async)
async def get_redis():
   redis = await aioredis.from_url("redis://localhost", decode_responses=True)
   return redis 
#  kết nối nối qua tên miền nội bộ , redis://127.0.0.1:6379  kết nối trực tiếp qua IPV4 . Hệ điều hành tự động phân giải (DNS nội bộ)
# - Có thể trỏ tới cả 127.0.0.1 hoặc IPv6 ::1 