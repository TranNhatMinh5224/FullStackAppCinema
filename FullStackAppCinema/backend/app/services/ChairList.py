
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, Depends
from app.models.models import Ghe, SuatChieu, Ve
from app.schemas.schemas import GheResponse
from app.database.Database import get_db
from app.redis.redis import redis_manager
import asyncio
async def list_ghe(suat_chieu_id, db = Depends(get_db)):
    # Tìm phòng chiếu của suất chiếu
    result = await db.execute(select(SuatChieu.phong_id).where(SuatChieu.id == suat_chieu_id))
    phong_id = result.scalar_one_or_none()

    if not phong_id:
        raise HTTPException(status_code=404, detail="Phòng chiếu không hợp lệ hoặc không tồn tại")

    # Lấy danh sách ghế trong phòng chiếu
    result = await db.execute(select(Ghe).where(Ghe.phong_id == phong_id))
    list_chair = result.scalars().all()

    # Lấy danh sách ghế đã bán (truy vấn 1 lần)
    result = await db.execute(select(Ve.ghe_id).where(Ve.suat_chieu_id == suat_chieu_id))
    list_ghe_da_ban = set(result.scalars().all())

    # Kiểm tra trạng thái ghế trong Redis (tối ưu hóa với `asyncio.gather()`)
    tasks = [redis_manager.kiem_tra_ghe(suat_chieu_id, ghe.id) for ghe in list_chair]
    results = await asyncio.gather(*tasks)
    list_ghe_redis = {ghe.id for ghe, is_held in zip(list_chair, results) if is_held}

    # Trả về danh sách ghế với trạng thái
    return [
        GheResponse(
            id=ghe.id,
            so_ghe=ghe.so_ghe,
            loai_ghe=ghe.loai_ghe,
            gia=float(ghe.gia),
            trang_thai=(
                "da_ban" if ghe.id in list_ghe_da_ban
                else "dang_giu" if ghe.id in list_ghe_redis
                else "trong"
            )
        )
        for ghe in list_chair
    ]

# async def list_ghe(suat_chieu_id: int, db: AsyncSession = Depends(get_db)):
#     # Tìm phòng chiếu của suất chiếu
#     result = await db.execute(select(SuatChieu.phong_id).where(SuatChieu.id == suat_chieu_id))
#     room = result.scalar_one_or_none()
    
#     if room is None or room == "":
#         raise HTTPException(status_code=404, detail="Phòng chiếu không hợp lệ hoặc không tồn tại")

#     # Lấy danh sách ghế trong phòng chiếu
#     chair = await db.execute(select(Ghe).where(Ghe.phong_id == room))
#     list_chair = chair.scalars().all()

#     # Lấy danh sách ghế đã bán
#     result = await db.execute(select(Ve.ghe_id).where(Ve.suat_chieu_id == suat_chieu_id))
#     list_ghe_da_ban = set(result.scalars().all())

#     # Kiểm tra ghế đang giữ trong Redis
#     tasks = [redis_manager.kiem_tra_ghe(suat_chieu_id, ghe.id) for ghe in list_chair]
#     results = await asyncio.gather(*tasks)
#     list_ghe_redis = {ghe.id for ghe, is_held in zip(list_chair, results) if is_held}

#     # Trả về danh sách ghế kèm trạng thái
#     return [
#         GheResponse(
#             id=ghe.id,
#             so_ghe=ghe.so_ghe,
#             loai_ghe=ghe.loai_ghe,
#             gia=float(ghe.gia),
#             trang_thai=(
#                 "da_ban" if ghe.id in list_ghe_da_ban
#                 else "dang_giu" if ghe.id in list_ghe_redis
#                 else "trong"
#             )
#         )
#         for ghe in list_chair
#     ]
