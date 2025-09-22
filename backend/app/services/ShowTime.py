from sqlalchemy.ext.asyncio import AsyncSession
import logging

from sqlalchemy.future import select
from fastapi import HTTPException
from datetime import datetime
from app.models.models import SuatChieu, LichChieu, PhongChieu
from app.schemas.SchemaShowTime import SuatChieuResponse, CreateSuatChieu ,UpdateSuatChieu
async def lay_suat_chieu_theo_lich_chieu(lich_chieu_id: int, db: AsyncSession):
    check = await db.execute(select(SuatChieu).where(SuatChieu.lich_chieu_id==lich_chieu_id).order_by(SuatChieu.gio_bat_dau)) 
    show = check.scalars().all() 
    if not show :
         raise HTTPException(status_code=404, detail="khung giờ  chiếu chưa được cập nhật ")
    return [SuatChieuResponse.model_validate(xuatchieu) for xuatchieu in show]

async def create_suat_chieu(db: AsyncSession, suat_chieu_data: CreateSuatChieu):
    new_suat_chieu = SuatChieu(
        lich_chieu_id=suat_chieu_data.lich_chieu_id,
        phong_id=suat_chieu_data.phong_id,
        gio_bat_dau=suat_chieu_data.gio_bat_dau,
        gio_ket_thuc=suat_chieu_data.gio_ket_thuc
    )
    db.add(new_suat_chieu)
    await db.commit()
    await db.refresh(new_suat_chieu)
    return new_suat_chieu
# Cập nhật suất chiếu
async def update_suat_chieu(suat_chieu_id: int, suat_chieu_data: UpdateSuatChieu, db: AsyncSession):
    query = await db.execute(select(SuatChieu).where(SuatChieu.id == suat_chieu_id))
    suat_chieu = query.scalar_one_or_none()

    if not suat_chieu:
        raise HTTPException(status_code=404, detail="Không tìm thấy suất chiếu")

    for key, value in suat_chieu_data.dict().items():
        setattr(suat_chieu, key, value)

    await db.commit()
    await db.refresh(suat_chieu)
    return suat_chieu

# Xóa suất chiếu
async def delete_suat_chieu(suat_chieu_id: int, db: AsyncSession):
    query = await db.execute(select(SuatChieu).where(SuatChieu.id == suat_chieu_id))
    suat_chieu = query.scalar_one_or_none()

    if not suat_chieu:
        raise HTTPException(status_code=404, detail="Không tìm thấy suất chiếu")

    await db.delete(suat_chieu)
    await db.commit()
    return {"message": "Xóa suất chiếu thành công"}




