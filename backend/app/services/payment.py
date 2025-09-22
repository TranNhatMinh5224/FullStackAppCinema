from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from datetime import datetime
import random
import asyncio

from app.models.models import Ve, Phim, PhongChieu, LichChieu, SuatChieu, Ghe, ThanhToan
from app.redis.redis import redis_manager
from app.schemas.schemas import TicketResponse

async def confirm_and_pay(suat_chieu_id: int, ghe_ids: list, user_id: int, phuong_thuc: str, tong_gia: float, db: AsyncSession):
    # Kiểm tra suất chiếu, tải luôn lich_chieu để tránh lazy loading
    result = await db.execute(
        select(SuatChieu)
        .options(joinedload(SuatChieu.lich_chieu))  # Tải trước lich_chieu
        .where(SuatChieu.id == suat_chieu_id)
    )
    suat_chieu = result.scalars().first()
    if not suat_chieu:
        raise HTTPException(status_code=404, detail="Suất chiếu không tồn tại")

    # Kiểm tra phim
    result = await db.execute(select(Phim).join(LichChieu).where(LichChieu.id == suat_chieu.lich_chieu_id))
    phim = result.scalars().first()
    if not phim:
        raise HTTPException(status_code=404, detail="Phim không tồn tại")

    # Kiểm tra phòng chiếu
    result = await db.execute(select(PhongChieu).where(PhongChieu.id == suat_chieu.phong_id))
    phong = result.scalars().first()
    if not phong:
        raise HTTPException(status_code=404, detail="Phòng chiếu không tồn tại")

    # Kiểm tra ghế
    ghe_info = []
    for ghe_id in ghe_ids:
        result = await db.execute(
            select(Ghe).where(Ghe.id == ghe_id, Ghe.phong_id == suat_chieu.phong_id)
        )
        seat = result.scalars().first()
        if not seat:
            raise HTTPException(status_code=404, detail=f"Ghế {ghe_id} không hợp lệ")

        result = await db.execute(
            select(Ve).where(
                Ve.suat_chieu_id == suat_chieu_id,
                Ve.ghe_id == ghe_id,
                Ve.trang_thai == "Đã xác nhận"
            )
        )
        if result.scalars().first():
            raise HTTPException(status_code=400, detail=f"Ghế {seat.so_ghe} đã được bán")

        current_user = await redis_manager.get_user_giu_ghe(suat_chieu_id, ghe_id)
        if current_user is None or current_user != user_id:
            raise HTTPException(status_code=400, detail=f"Ghế {seat.so_ghe} không còn được giữ cho bạn")

        ghe_info.append(seat.so_ghe)

    # Tạo bản ghi ThanhToan
    ma_giao_dich = f"0{int(datetime.now().timestamp())}"
    thanh_toan = ThanhToan(
        phuong_thuc=phuong_thuc,
        trang_thai="Đã thanh_toan",  # Trạng thái mặc định là thành công
        ngay_thanh_toan=datetime.now().date(),
        so_tien=tong_gia,
        ma_giao_dich=ma_giao_dich
    )
    db.add(thanh_toan)
    await db.flush()  # Lấy thanh_toan.id

    # Tạo các vé
    ve_ids = []
    for ghe_id in ghe_ids:
        result = await db.execute(select(Ghe).where(Ghe.id == ghe_id))
        seat = result.scalars().first()
        ve = Ve(
            user_id=user_id,
            suat_chieu_id=suat_chieu_id,
            ghe_id=ghe_id,
            thanh_toan_id=thanh_toan.id,
            trang_thai="Đã xác nhận",
            gia_ve=seat.gia,
            created_at=datetime.now()
        )
        db.add(ve)
        await db.flush()  # Lấy ve.id
        ve_ids.append(ve.id)

    # Commit transaction
    await db.commit()

    # Xóa ghế khỏi Redis
    tasks = [redis_manager.xoa_ghe_tam_thoi(suat_chieu_id, ghe_id) for ghe_id in ghe_ids]
    await asyncio.gather(*tasks)

    # Trả về response
    return TicketResponse(
        ve_ids=ve_ids,
        ten_phim=phim.ten_phim,
        ngay_chieu=suat_chieu.lich_chieu.ngay_chieu.strftime("%Y-%m-%d"),
        gio_bat_dau=suat_chieu.gio_bat_dau.strftime("%H:%M"),
        phong=phong.ten_phong,
        ghe=ghe_info,
        tong_gia=tong_gia,
        trang_thai="Đã xác nhận",
        ma_giao_dich=ma_giao_dich
    )



# from fastapi import HTTPException
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy.future import select
# from datetime import datetime
# import asyncio

# from app.models.models import Ve, Phim, PhongChieu, LichChieu, SuatChieu, Ghe, ThanhToan
# from app.redis.redis import redis_manager
# from app.schemas.schemas import TicketResponse

# async def confirm_and_pay(suat_chieu_id: int, ghe_ids: list, user_id: int, phuong_thuc: str, tong_gia: float, db: AsyncSession):
#     # Kiểm tra suất chiếu
#     result = await db.execute(select(SuatChieu).where(SuatChieu.id == suat_chieu_id))
#     suat_chieu = result.scalars().first()
#     if not suat_chieu:
#         raise HTTPException(status_code=404, detail="Suất chiếu không tồn tại")

#     # Kiểm tra phim
#     result = await db.execute(select(Phim).join(LichChieu).where(LichChieu.id == suat_chieu.lich_chieu_id))
#     phim = result.scalars().first()
#     if not phim:
#         raise HTTPException(status_code=404, detail="Phim không tồn tại")

#     # Kiểm tra phòng chiếu
#     result = await db.execute(select(PhongChieu).where(PhongChieu.id == suat_chieu.phong_id))
#     phong = result.scalars().first()
#     if not phong:
#         raise HTTPException(status_code=404, detail="Phòng chiếu không tồn tại")

#     # Kiểm tra ghế
#     ghe_info = []
#     for ghe_id in ghe_ids:
#         result = await db.execute(
#             select(Ghe).where(Ghe.id == ghe_id, Ghe.phong_id == suat_chieu.phong_id)
#         )
#         seat = result.scalars().first()
#         if not seat:
#             raise HTTPException(status_code=404, detail=f"Ghế {ghe_id} không hợp lệ")

#         result = await db.execute(
#             select(Ve).where(
#                 Ve.suat_chieu_id == suat_chieu_id,
#                 Ve.ghe_id == ghe_id,
#                 Ve.trang_thai == "Đã xác nhận"
#             )
#         )
#         if result.scalars().first():
#             raise HTTPException(status_code=400, detail=f"Ghế {seat.so_ghe} đã được bán")

#         current_user = await redis_manager.get_user_giu_ghe(suat_chieu_id, ghe_id)
#         if current_user is None or current_user != user_id:
#             raise HTTPException(status_code=400, detail=f"Ghế {seat.so_ghe} không còn được giữ cho bạn")

#         ghe_info.append(seat.so_ghe)

#     # Tạo bản ghi ThanhToan trước
#     ma_giao_dich = f"TX{int(datetime.now().timestamp())}"
#     thanh_toan = ThanhToan(
#         phuong_thuc=phuong_thuc,
#         trang_thai="Đang xử lý",
#         ngay_thanh_toan=datetime.now().date(),
#         so_tien=tong_gia,
#         ma_giao_dich=ma_giao_dich
#     )
#     db.add(thanh_toan)
#     await db.flush()  # Lấy thanh_toan.id

#     # Giả lập thanh toán
#     payment_success = True  # Thay bằng logic thực tế nếu cần
#     if not payment_success:
#         await db.delete(thanh_toan)
#         await db.commit()
#         raise HTTPException(status_code=400, detail="Thanh toán thất bại")

#     # Cập nhật trạng thái thanh toán
#     thanh_toan.trang_thai = "Đã thanh_toan"
#     db.add(thanh_toan)

#     # Tạo các vé sau khi thanh toán thành công
#     ve_ids = []
#     for ghe_id in ghe_ids:
#         result = await db.execute(select(Ghe).where(Ghe.id == ghe_id))
#         seat = result.scalars().first()
#         ve = Ve(
#             user_id=user_id,
#             suat_chieu_id=suat_chieu_id,
#             ghe_id=ghe_id,
#             thanh_toan_id=thanh_toan.id,
#             trang_thai="Đã xác nhận",
#             gia_ve=seat.gia,
#             created_at=datetime.now()
#         )
#         db.add(ve)
#         await db.flush()  # Lấy ve.id
#         ve_ids.append(ve.id)

#     await db.commit()

#     # Xóa ghế khỏi Redis
#     tasks = [redis_manager.xoa_ghe_tam_thoi(suat_chieu_id, ghe_id) for ghe_id in ghe_ids]
#     await asyncio.gather(*tasks)

#     return TicketResponse(
#         ve_ids=ve_ids,
#         ten_phim=phim.ten_phim,
#         ngay_chieu=suat_chieu.lich_chieu.ngay_chieu.strftime("%Y-%m-%d"),
#         gio_bat_dau=suat_chieu.gio_bat_dau.strftime("%H:%M"),
#         phong=phong.ten_phong,
#         ghe=ghe_info,
#         tong_gia=tong_gia,
#         trang_thai="Đã xác nhận",
#         ma_giao_dich=ma_giao_dich
#     )