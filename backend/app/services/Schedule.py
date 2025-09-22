from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from datetime import date

from app.models.models import LichChieu, Phim
from app.schemas.SchemaSchedule import (
    CreateLichChieu,
    CreateLichChieuResponse,
    UpdateLichChieu,
    UpdateLichChieuResponse,
    DeleteLichChieuResponse,
    LichChieuResponse
)



async def lay_lich_chieu_theo_phim(phim_id: int, db: AsyncSession):
    query = await db.execute(select(LichChieu).where(LichChieu.phim_id == phim_id))
    lich_chieu_list = query.scalars().all()

    if not lich_chieu_list:
        raise HTTPException(status_code=404, detail="Không có lịch chiếu cho phim này")

    return [LichChieuResponse(id=lc.id, phim_id=lc.phim_id, ngay_chieu=lc.ngay_chieu) for lc in lich_chieu_list]
#  Tạo lịch chiếu mới
async def tao_lich_chieu(schedule: CreateLichChieu, db: AsyncSession):
    # Kiểm tra xem phim có tồn tại không
    phim_query = await db.execute(select(Phim).where(Phim.id == schedule.phim_id))
    phim = phim_query.scalar_one_or_none()
    if not phim:
        raise HTTPException(status_code=404, detail="Phim này không tồn tại")

    # Kiểm tra ngày chiếu hợp lệ
    if schedule.ngay_chieu < phim.ngay_khoi_chieu or schedule.ngay_chieu > phim.ngay_ket_thuc:
        raise HTTPException(status_code=400, detail="Ngày chiếu không hợp lệ")

    # Kiểm tra xem lịch chiếu đã tồn tại chưa
    query = await db.execute(
        select(LichChieu).where(
            LichChieu.phim_id == schedule.phim_id,
            LichChieu.ngay_chieu == schedule.ngay_chieu
        )
    )
    existing_schedule = query.scalar_one_or_none()
    if existing_schedule:
        raise HTTPException(status_code=400, detail="Lịch chiếu cho phim này vào ngày này đã tồn tại!")

    # Thêm lịch chiếu mới
    new_schedule = LichChieu(
        phim_id=schedule.phim_id,
        ngay_chieu=schedule.ngay_chieu
    )
    db.add(new_schedule)
    await db.flush()  # Đảm bảo new_schedule có ID hợp lệ trước khi commit
    await db.commit()
    await db.refresh(new_schedule)

    return CreateLichChieuResponse(message=f"Tạo lịch chiếu ngày {new_schedule.ngay_chieu} thành công")

#  Cập nhật lịch chiếu
async def cap_nhat_lich_chieu(schedule_id: int, updateschedule: UpdateLichChieu, db: AsyncSession):
    query = await db.execute(select(LichChieu).where(LichChieu.id == schedule_id))
    result = query.scalar_one_or_none()
    if not result:
        raise HTTPException(status_code=404, detail="Lịch chiếu không tồn tại")

    if updateschedule.ngay_chieu < date.today():
        raise HTTPException(status_code=400, detail="Ngày chiếu không hợp lệ")

    result.ngay_chieu = updateschedule.ngay_chieu
    await db.commit()
    await db.refresh(result)
    
    return UpdateLichChieuResponse(message="Cập nhật lịch chiếu thành công", ngay_chieu_moi=result.ngay_chieu)

#  Xóa lịch chiếu
async def xoa_lich_chieu(schedule_id: int, db: AsyncSession):
    query = await db.execute(select(LichChieu).where(LichChieu.id == schedule_id))
    result = query.scalar_one_or_none()
    if result is None:
        raise HTTPException(status_code=404, detail="Lịch chiếu không tồn tại")

    ngay_chieu = result.ngay_chieu  # Lưu ngày chiếu để phản hồi
    await db.delete(result)
    await db.commit()
    
    return DeleteLichChieuResponse(message="Xóa lịch chiếu thành công", ngay_chieu=ngay_chieu)
