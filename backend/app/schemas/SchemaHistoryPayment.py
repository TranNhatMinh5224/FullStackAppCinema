from pydantic import BaseModel 
from datetime import datetime
from typing import Optional
from typing import List 

class HistoryPayment(BaseModel):
   
    phuong_thuc: str
    trang_thai: str
    ngay_thanh_toan: Optional[datetime]
    so_tien: float
    ma_giao_dich: Optional[str]

    class Config:
        from_attributes = True 