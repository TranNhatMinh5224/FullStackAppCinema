from pydantic import BaseModel
from datetime import date

# Schema để tạo lịch chiếu mới
class CreateLichChieu(BaseModel):
    phim_id: int
    ngay_chieu: date

class CreateLichChieuResponse(BaseModel):
    message: str

# Schema để cập nhật lịch chiếu
class UpdateLichChieu(BaseModel):
    ngay_chieu: date

class UpdateLichChieuResponse(BaseModel):
    message: str
    ngay_chieu_moi: date

# Schema để xóa lịch chiếu
class DeleteLichChieuResponse(BaseModel):
    message: str
    ngay_chieu: date

class LichChieuResponse(BaseModel):
    id: int
    phim_id: int
    ngay_chieu: date 
    class Config:
        from_attributes = True 
