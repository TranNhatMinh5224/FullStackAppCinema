# from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from typing import List

from app.models.models import Ve, SuatChieu, LichChieu, Phim, PhongChieu, Ghe, ThanhToan
from app.schemas.SchemaVeDetail import VeDetailResponse

async def get_all_ve_details(user_id: int, db: AsyncSession) -> dict:
    """Lấy ra chi tiết toàn bộ vé đã mua của người dùng."""
    try:
        # Query thật từ database
        result = await db.execute(
            select(Ve)
            .where(Ve.user_id == user_id, Ve.trang_thai == "Đã xác nhận")
            .order_by(Ve.created_at.desc())
        )
        ves = result.scalars().all()

        ve_details = []
        for ve in ves:
            try:
                # Lấy thông tin từ các bảng liên quan
                suat_chieu_result = await db.execute(
                    select(SuatChieu).where(SuatChieu.id == ve.suat_chieu_id)
                )
                suat_chieu = suat_chieu_result.scalar_one_or_none()
                
                if suat_chieu:
                    lich_chieu_result = await db.execute(
                        select(LichChieu).where(LichChieu.id == suat_chieu.lich_chieu_id)
                    )
                    lich_chieu = lich_chieu_result.scalar_one_or_none()
                    
                    if lich_chieu:
                        phim_result = await db.execute(
                            select(Phim).where(Phim.id == lich_chieu.phim_id)
                        )
                        phim = phim_result.scalar_one_or_none()
                        
                        phong_result = await db.execute(
                            select(PhongChieu).where(PhongChieu.id == suat_chieu.phong_id)
                        )
                        phong = phong_result.scalar_one_or_none()
                        
                        ghe_result = await db.execute(
                            select(Ghe).where(Ghe.id == ve.ghe_id)
                        )
                        ghe = ghe_result.scalar_one_or_none()
                        
                        thanh_toan_result = await db.execute(
                            select(ThanhToan).where(ThanhToan.id == ve.thanh_toan_id)
                        )
                        thanh_toan = thanh_toan_result.scalar_one_or_none()
                        
                        ve_detail = {
                            "id": ve.id,
                            "ten_phim": phim.ten_phim if phim else "N/A",
                            "anh_phim": phim.hinh_anh if phim else "",
                            "ngay_chieu": str(lich_chieu.ngay_chieu) if lich_chieu else "N/A",
                            "gio_bat_dau": str(suat_chieu.gio_bat_dau) if suat_chieu else "N/A",
                            "gio_ket_thuc": str(suat_chieu.gio_ket_thuc) if suat_chieu else "N/A",
                            "phong_chieu": str(phong.ten_phong) if phong else "N/A",
                            "danh_sach_ghe": [ghe.so_ghe] if ghe else ["N/A"],
                            "so_tien": float(ve.gia_ve),
                            "ma_giao_dich": thanh_toan.ma_giao_dich if thanh_toan else "N/A"
                        }
                        ve_details.append(ve_detail)
                    else:
                        print(f"LichChieu not found for suat_chieu_id: {ve.suat_chieu_id}")
                else:
                    print(f"SuatChieu not found for id: {ve.suat_chieu_id}")
            except Exception as ve_error:
                print(f"Error processing ve {ve.id}: {ve_error}")
                continue

        return {
            "success": True,
            "data": ve_details,
            "message": f"Tìm thấy {len(ve_details)} vé"
        }
        
    except Exception as e:
        print(f"Error in get_all_ve_details: {e}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return {
            "success": False,
            "data": [],
            "message": f"Lỗi: {str(e)}"
        }
