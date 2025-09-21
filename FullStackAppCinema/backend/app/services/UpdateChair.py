from fastapi import  HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import SuatChieu ,Ghe 
from sqlalchemy.future import select
from app.redis.redis import redis_manager


async def update_seats(suat_chieu_id: int, ghe_ids: list, user_id: int, db: AsyncSession):
    result = await db.execute(select(SuatChieu).where(SuatChieu.id == suat_chieu_id))
    suat_chieu = result.scalars().first()
    if not suat_chieu:
        raise HTTPException(status_code=404, detail="Suất chiếu không tồn tại")

    # XÓA GHẾ CŨ do user này đã giữ
    await redis_manager.xoa_ghe_cua_user(suat_chieu_id, user_id)

    selected_seats = []
    for ghe_id in ghe_ids:
        result = await db.execute(
            select(Ghe).where(Ghe.id == ghe_id, Ghe.phong_id == suat_chieu.phong_id)
        )
        seat = result.scalars().first()
        if not seat:
            raise HTTPException(status_code=404, detail=f"Ghế {ghe_id} không hợp lệ hoặc không thuộc suất chiếu này")

        if await redis_manager.kiem_tra_ghe(suat_chieu_id, ghe_id):
            raise HTTPException(status_code=400, detail=f"Ghế {seat.so_ghe} đang được giữ bởi người khác")

        if await redis_manager.set_ghe_tam_thoi(suat_chieu_id, ghe_id, user_id):
            selected_seats.append(ghe_id)
        else:
            raise HTTPException(status_code=400, detail=f"Ghế {seat.so_ghe} vừa bị người khác giữ")

    return {"message": "Cập nhật ghế thành công"}
