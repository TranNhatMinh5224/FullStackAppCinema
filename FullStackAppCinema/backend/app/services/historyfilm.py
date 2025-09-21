

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from typing import List

from app.models.models import Ve, SuatChieu, LichChieu, Phim, PhongChieu, Ghe
from app.schemas.schemas import LichSuPhimResponse
async def get_lich_su_phim(user_id: int, db: AsyncSession) -> List[LichSuPhimResponse]:
    # Truy vấn vé của user, tải trước các relationship cần thiết
    result = await db.execute(
        select(Ve)
        .options(
            joinedload(Ve.suat_chieu).joinedload(SuatChieu.lich_chieu).joinedload(LichChieu.phim),
            joinedload(Ve.suat_chieu).joinedload(SuatChieu.phong),
            joinedload(Ve.ghe),
            joinedload(Ve.thanh_toan) 
        )
        .where(Ve.user_id == user_id, Ve.trang_thai == "Đã xác nhận")
        .order_by(Ve.created_at.desc())  # Sắp xếp theo thời gian giảm dần
    )
    ve_list = result.scalars().all()

    if not ve_list:
        raise HTTPException(status_code=404, detail="Không tìm thấy lịch sử xem phim")

    # Nhóm vé theo suất chiếu và tính tổng số tiền từ gia_ve
    lich_su_phim = {}
    for ve in ve_list:
        suat_chieu_id = ve.suat_chieu_id
        if suat_chieu_id not in lich_su_phim:
            lich_su_phim[suat_chieu_id] = {
                "ten_phim": ve.suat_chieu.lich_chieu.phim.ten_phim,
                "anh_phim": ve.suat_chieu.lich_chieu.phim.hinh_anh,
                "danh_sach_ghe": [],
                "phong_chieu": ve.suat_chieu.phong.ten_phong,
                "ngay_chieu": ve.suat_chieu.lich_chieu.ngay_chieu,
                "gio_bat_dau": ve.suat_chieu.gio_bat_dau,
                "gio_ket_thuc": ve.suat_chieu.gio_ket_thuc,
                "so_tien": 0.0,  # Khởi tạo tổng số tiền
                "ma_giao_dich": ve.thanh_toan.ma_giao_dich 
            }
        # Thêm ghế vào danh sách
        lich_su_phim[suat_chieu_id]["danh_sach_ghe"].append(ve.ghe.so_ghe)
        # Cộng dồn giá vé vào tổng số tiền
        lich_su_phim[suat_chieu_id]["so_tien"] += float(ve.gia_ve)

    # Chuyển dict thành list để trả về
    return [LichSuPhimResponse(**data) for data in lich_su_phim.values()]


# async def get_lich_su_phim(user_id: int, db: AsyncSession) -> List[LichSuPhimResponse]:
#     # Truy vấn vé của user, tải trước các relationship cần thiết
#     result = await db.execute(
#         select(Ve)
#         .options(
#             joinedload(Ve.suat_chieu).joinedload(SuatChieu.lich_chieu).joinedload(LichChieu.phim),
#             joinedload(Ve.suat_chieu).joinedload(SuatChieu.phong),
#             joinedload(Ve.ghe)
#         )
#         .where(Ve.user_id == user_id, Ve.trang_thai == "Đã xác nhận")
#         .order_by(Ve.created_at.desc())  # Sắp xếp theo thời gian giảm dần
#     )
#     ve_list = result.scalars().all()

#     if not ve_list:
#         raise HTTPException(status_code=404, detail="Không tìm thấy lịch sử xem phim")

#     # Nhóm vé theo suất chiếu và tính tổng số tiền từ gia_ve
#     lich_su_phim = {}
#     for ve in ve_list:
#         suat_chieu_id = ve.suat_chieu_id
#         if suat_chieu_id not in lich_su_phim:
#             lich_su_phim[suat_chieu_id] = {
                
#                 "ten_phim": ve.suat_chieu.lich_chieu.phim.ten_phim,
#                 "anh_phim": ve.suat_chieu.lich_chieu.phim.hinh_anh ,
#                 "danh_sach_ghe": [],
#                 "phong_chieu": ve.suat_chieu.phong.ten_phong,
#                 "ngay_chieu": ve.suat_chieu.lich_chieu.ngay_chieu,
#                 "gio_bat_dau": ve.suat_chieu.gio_bat_dau,
#                 "gio_ket_thuc": ve.suat_chieu.gio_ket_thuc,
#                 "so_tien": 0.0  # Khởi tạo tổng số tiền
#             }
#         # Thêm ghế vào danh sách
#         lich_su_phim[suat_chieu_id]["danh_sach_ghe"].append(ve.ghe.so_ghe)
#         # Cộng dồn giá vé vào tổng số tiền
#         lich_su_phim[suat_chieu_id]["so_tien"] += float(ve.gia_ve)

#     # Chuyển dict thành list để trả về
#     return [LichSuPhimResponse(**data) for data in lich_su_phim.values()]