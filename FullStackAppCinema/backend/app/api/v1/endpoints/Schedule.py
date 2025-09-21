from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.Database import get_db
from app.services.Schedule import (
    tao_lich_chieu,
    cap_nhat_lich_chieu,
    xoa_lich_chieu , 
    lay_lich_chieu_theo_phim
)
from app.schemas.SchemaSchedule import (
    CreateLichChieu,
    CreateLichChieuResponse,
    UpdateLichChieu,
    UpdateLichChieuResponse,
    DeleteLichChieuResponse,
    LichChieuResponse
)

router = APIRouter(prefix="/lichchieu", tags=["Lịch Chiếu"])


@router.get("/phim/{phim_id}", response_model=list[LichChieuResponse])
async def get_lich_chieu_theo_phim(phim_id: int, db: AsyncSession = Depends(get_db)):
    return await lay_lich_chieu_theo_phim(phim_id, db)

# 📌 Tạo lịch chiếu mới
@router.post("/", response_model=CreateLichChieuResponse)
async def create_lichchieu(schedule: CreateLichChieu, db: AsyncSession = Depends(get_db)):
    return await tao_lich_chieu(schedule, db)

#  Cập nhật lịch chiếu
@router.put("/{schedule_id}", response_model=UpdateLichChieuResponse)
async def update_lichchieu(schedule_id: int, updateschedule: UpdateLichChieu, db: AsyncSession = Depends(get_db)):
    return await cap_nhat_lich_chieu(schedule_id, updateschedule, db)

#  Xóa lịch chiếu
@router.delete("/{schedule_id}", response_model=DeleteLichChieuResponse)
async def delete_lichchieu(schedule_id: int, db: AsyncSession = Depends(get_db)):
    return await xoa_lich_chieu(schedule_id, db)
