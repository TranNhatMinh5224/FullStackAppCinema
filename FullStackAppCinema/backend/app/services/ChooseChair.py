from fastapi import  HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import SuatChieu ,Ghe 
from sqlalchemy.future import select
from app.redis.redis import redis_manager

async def select_seats(suat_chieu_id: int, ghe_ids: list, user_id: int, db: AsyncSession):
    # Kiểm tra suất chiếu có tồn tại không
    result = await db.execute(select(SuatChieu).where(SuatChieu.id == suat_chieu_id))
    suat_chieu = result.scalars().first()
    if not suat_chieu:
        raise HTTPException(status_code=404, detail="Suất chiếu không tồn tại")

    selected_seats = []
    for ghe_id in ghe_ids:
        # Kiểm tra ghế có hợp lệ và thuộc phòng chiếu của suất chiếu không
        result = await db.execute(
            select(Ghe).where(Ghe.id == ghe_id, Ghe.phong_id == suat_chieu.phong_id)
        )
        seat = result.scalars().first()
        if not seat:
            raise HTTPException(status_code=404, detail=f"Ghế {ghe_id} không hợp lệ hoặc không thuộc suất chiếu này")
        # Kiểm tra xem ghế có đang được giữ trong Redis không
        if await redis_manager.kiem_tra_ghe(suat_chieu_id, ghe_id):
            raise HTTPException(status_code=400, detail=f"Ghế {seat.so_ghe} đang được giữ bởi người khác")

        # Giữ ghế tạm thời trong Redis
        if await redis_manager.set_ghe_tam_thoi(suat_chieu_id, ghe_id, user_id):
            selected_seats.append(ghe_id)
        else:
            raise HTTPException(status_code=400, detail=f"Ghế {seat.so_ghe} vừa bị người khác giữ")

    # Trả về phản hồi với danh sách ghế đã chọn
    return {"message": "Chiếm ghế tạm thời thành công"}

async def DeleteSelectedSeats(suat_chieu_id: int, ghe_ids: list, user_id: int, db: AsyncSession):
    for ghe_id in ghe_ids:
        # Lấy user đang giữ ghế từ Redis
        current_user = await redis_manager.get_user_giu_ghe(suat_chieu_id, ghe_id)
        
        # Kiểm tra quyền xóa
        if current_user != user_id:
            raise HTTPException(
                status_code=400,
                detail=f"Ghế {ghe_id} không thuộc về người dùng này hoặc đã hết hạn giữ ghế"
            )

        # Xóa ghế
        await redis_manager.xoa_ghe_tam_thoi(suat_chieu_id, ghe_id)

    return {"message": "Xóa ghế tạm thời thành công"}