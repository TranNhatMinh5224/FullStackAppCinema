from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from app.models.models import Phim, LichChieu, SuatChieu
from app.schemas.SchemaBooking import PhimResponse, LichChieuResponse, SuatChieuResponse

async def get_phim_full(phim_id: int, db: AsyncSession):
    # Lấy thông tin phim
    query = await db.execute(select(Phim).where(Phim.id == phim_id))
    film = query.scalar_one_or_none()

    if not film:
        raise HTTPException(status_code=404, detail="Phim không tồn tại!")

    # Lấy danh sách lịch chiếu của phim
    query = await db.execute(select(LichChieu).where(LichChieu.phim_id == phim_id))
    schedules = query.scalars().all()

    # if not schedules:
    #     raise HTTPException(status_code=404, detail="Không có lịch chiếu trong phim này!")

    schedule_data = []
    for schedule in schedules:
        # Lấy danh sách suất chiếu cho từng lịch chiếu
        query = await db.execute(select(SuatChieu).where(SuatChieu.lich_chieu_id == schedule.id))
        showtimes = query.scalars().all()

        suat_chieu_data = [
            SuatChieuResponse(id=sc.id, gio_bat_dau=sc.gio_bat_dau, gio_ket_thuc=sc.gio_ket_thuc)
            for sc in showtimes
        ]

        # Thêm dữ liệu lịch chiếu vào danh sách
        schedule_data.append(
            LichChieuResponse(
                id=schedule.id,
                ngay_chieu=schedule.ngay_chieu,
                suat_chieu=suat_chieu_data
            )
        )

    # Trả về dữ liệu theo schema PhimResponse
    return PhimResponse(
        id=film.id,
        ten_phim=film.ten_phim,
        mo_ta=film.mo_ta,
        ngay_khoi_chieu=film.ngay_khoi_chieu,
        ngay_ket_thuc=film.ngay_ket_thuc,
        the_loai=film.the_loai,
        dao_dien=film.dao_dien,
        thoi_luong=film.thoi_luong,
        dien_vien=film.dien_vien,
        hinh_anh=film.hinh_anh,
        trailer=film.trailer,
        lich_chieu=schedule_data
    )
