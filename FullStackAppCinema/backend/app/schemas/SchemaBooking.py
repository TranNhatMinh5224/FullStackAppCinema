from pydantic import BaseModel
from datetime import date, time
from typing import List, Optional


# 🎬 Schema cho response của suất chiếu
class SuatChieuResponse(BaseModel):
    id: int
    gio_bat_dau: time
    gio_ket_thuc: time


# 🗓️ Schema cho response của lịch chiếu (chứa danh sách suất chiếu)
class LichChieuResponse(BaseModel):
    id: int
    ngay_chieu: date
    suat_chieu: List[SuatChieuResponse]


# 🎥 Schema cho response của phim (chứa danh sách lịch chiếu)
class PhimResponse(BaseModel):
    id: int
    ten_phim: str
    mo_ta:  Optional[str] = None
    ngay_khoi_chieu: date
    ngay_ket_thuc: date
    the_loai:  Optional[str] = None
    dao_dien:  Optional[str] = None
    thoi_luong:  int
    dien_vien:  Optional[str] = None
    hinh_anh:  Optional[str] = None
    trailer:  Optional[str] = None
    lich_chieu: List[LichChieuResponse]
    
 
