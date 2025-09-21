from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql import func, exists
from fastapi import HTTPException
from app.models.models import BinhLuan, Ve, LichChieu, SuatChieu
from datetime import datetime
from app.schemas.schemas import BinhLuanRequest, BinhLuanResponse, DanhGiaResponse

async def tao_binh_luan(user_id: int, request: BinhLuanRequest, db: AsyncSession):
   
    # Kiểm tra danh_gia hợp lệ (nếu có)
    if request.danh_gia is not None and (request.danh_gia < 1 or request.danh_gia > 5):
        raise HTTPException(status_code=400, detail="Điểm đánh giá phải từ 1 đến 5.")

    # Kiểm tra nếu user đã xem phim bằng cách kiểm tra sự tồn tại của vé
    query = select(exists().where(
        Ve.user_id == user_id,
        Ve.suat_chieu.has(SuatChieu.lich_chieu.has(LichChieu.phim_id == request.phim_id))
    ))
    da_xem_phim = await db.execute(query)
    
    if not da_xem_phim.scalar() and request.danh_gia is not None:
        raise HTTPException(status_code=400, detail="Bạn chưa xem phim này nên không thể đánh giá sao.")

    # Tạo bình luận mới
    binh_luan = BinhLuan(
        user_id=user_id,
        phim_id=request.phim_id,
        noi_dung=request.noi_dung,
        danh_gia=request.danh_gia,
        ngay_binh_luan=datetime.now()
    )

    db.add(binh_luan)
    await db.commit()
    await db.refresh(binh_luan)

    return {"message": "Bình luận thành công", "data": BinhLuanResponse(**binh_luan.__dict__)}


async def lay_binh_luan(phim_id: int, db: AsyncSession):
   
    # Lấy danh sách bình luận và điểm trung bình cùng một truy vấn
    query = select(BinhLuan, func.avg(BinhLuan.danh_gia).over()).filter(
        BinhLuan.phim_id == phim_id
    )
    result = await db.execute(query)
    
    binh_luan_list = []
    avg_rating = None

    for binh_luan, avg in result.all():
        binh_luan_list.append(BinhLuanResponse(**binh_luan.__dict__))
        avg_rating = avg

    return DanhGiaResponse(
        phim_id=phim_id,
        danh_gia_trung_binh=round(avg_rating, 1) if avg_rating else 0,
        binh_luan=binh_luan_list
    )
