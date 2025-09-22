from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel
from datetime import time
from typing import List , Dict , Any

# sd để trả về film xắp chiếu và film đang chiếu 
class PhimSimpleResponse(BaseModel):
    id: int
    title: str
    image: Optional[str] = None
    category: Optional[str] = None
    trailer: Optional[str] = None  
    duration: Optional[int] = None
    trang_thai: Optional[bool] = None
    
    class Config:
        from_attributes = True


class AddFilm(BaseModel):
     ten_phim: str
     mo_ta: str
     ngay_khoi_chieu: date
     ngay_ket_thuc: date
     the_loai: str
     dao_dien: str
     thoi_luong: int
     dien_vien:str
     hinh_anh: str
     trailer: str
     class Config:
        from_attributes = True
class AddFilmResponse(BaseModel):
    message: str
    
    class Config:
        from_attributes = True
class  DeleteFilmResponse(BaseModel):
    message:str
    class Config:
        from_attributes = True 
class PhimUpdateSchema(BaseModel):
    ten_phim: Optional[str] = None
    mo_ta: Optional[str] = None
    ngay_khoi_chieu: Optional[date] = None
    ngay_ket_thuc: Optional[date] = None
    the_loai: Optional[str] = None
    dao_dien: Optional[str] = None
    thoi_luong: Optional[int] = None
    dien_vien: Optional[str] = None
    hinh_anh: Optional[str] = None
    trailer: Optional[str] = None