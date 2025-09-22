from pydantic import BaseModel, ConfigDict
from datetime import time
from typing import Optional

# Schema tạo suất chiếu
class CreateSuatChieu(BaseModel):
    lich_chieu_id: int
    phong_id: int
    gio_bat_dau: time
    gio_ket_thuc: time

# Schema cập nhật suất chiếu
class UpdateSuatChieu(BaseModel):
    phong_id: int
    gio_bat_dau: time
    gio_ket_thuc: time

# Schema phản hồi chi tiết suất chiếu
class SuatChieuData(BaseModel):
    id: int
    phong_id: int
    gio_bat_dau: time
    gio_ket_thuc: time
    lich_chieu_id: int

    model_config = ConfigDict(from_attributes=True)  # Sửa theo Pydantic v2

# Schema phản hồi chung
class SuatChieuResponse(BaseModel):
    message: str
    data: Optional[SuatChieuData] = None

