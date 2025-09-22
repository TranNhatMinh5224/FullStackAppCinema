from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class VeDetailItem(BaseModel):
    id: int
    ten_phim: str
    anh_phim: str
    ngay_chieu: str
    gio_bat_dau: str
    gio_ket_thuc: str
    phong_chieu: str
    danh_sach_ghe: List[str]
    so_tien: float
    ma_giao_dich: str

class VeDetailResponse(BaseModel):
    success: bool
    data: List[VeDetailItem]
    message: Optional[str] = None





