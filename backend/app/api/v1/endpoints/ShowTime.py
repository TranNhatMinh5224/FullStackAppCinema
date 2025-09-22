from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.Database import get_db
from app.schemas.SchemaShowTime import  SuatChieuData  , CreateSuatChieu, UpdateSuatChieu, SuatChieuResponse
from app.services.ShowTime import lay_suat_chieu_theo_lich_chieu  , create_suat_chieu , update_suat_chieu ,delete_suat_chieu   # tao_suat_chieu, xoa_suat_chieu, cap_nhat_suat_chieu, 

router = APIRouter(prefix="/admin", tags=["Suất chiếu"])


@router.post("/suat-chieu/", response_model=SuatChieuResponse)
async def add_suat_chieu(suat_chieu: CreateSuatChieu, db: AsyncSession = Depends(get_db)):
    new_suat_chieu = await create_suat_chieu(db, suat_chieu)
    return {"message": "Suất chiếu được tạo thành công", "data": new_suat_chieu}



# lấy danh sách suất chiếu 
@router.get("/lich-chieu/{lich_chieu_id}", response_model=list[SuatChieuData])
async def get_suat_chieu_theo_lich_chieu(lich_chieu_id: int, db: AsyncSession = Depends(get_db)):
    return await lay_suat_chieu_theo_lich_chieu(lich_chieu_id, db)
# Sửa suất chiếu
@router.put("/suat-chieu/{suat_chieu_id}", response_model=SuatChieuResponse)
async def sua_suat_chieu( suat_chieu_id: int,  suat_chieu: UpdateSuatChieu,db: AsyncSession = Depends(get_db)):
    updated = await update_suat_chieu(suat_chieu_id, suat_chieu, db)
    return {"message": "Cập nhật suất chiếu thành công", "data": updated}

# Xóa suất chiếu
@router.delete("/suat-chieu/{suat_chieu_id}")
async def xoa_suat_chieu(suat_chieu_id: int, db: AsyncSession = Depends(get_db)):
    return await delete_suat_chieu(suat_chieu_id, db)
