from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel
from datetime import time
from typing import List , Dict , Any


# Schema cho tài khoản (người dùng)
class TaiKhoanCreate(BaseModel):
    email: EmailStr
    mat_khau: str
    ten: str
    sdt: str  # Giới hạn độ dài số điện thoại
    gioi_tinh: Optional[bool] = None
    ngay_sinh: Optional[date] = None
    dia_chi: Optional[str] = None

# Schema đăng nhập
class TaiKhoanLogin(BaseModel):
    email: EmailStr
    mat_khau: str

# Schema phản hồi đăng ký
class RegisterResponse(BaseModel):
    message: str
    user_id: int
    class Config:
        from_attributes = True

# Schema thông tin người dùng
class TaiKhoanResponse(BaseModel):
    id: int
    email: EmailStr
    phone: str
    gender: Optional[bool] = None
    dob: Optional[date] = None
    address: Optional[str] = None
    name: str
    class Config:
        from_attributes = True

# Schema phản hồi đăng nhập
class LoginResponse(BaseModel):
    message: str
    user: TaiKhoanResponse
    class Config:
        from_attributes = True

# Schema cập nhật thông tin người dùng
class TaiKhoanUpdate(BaseModel):
    ten: Optional[str] = None
    sdt: Optional[str] = None
    gioi_tinh: Optional[bool] = None
    ngay_sinh: Optional[date] = None
    dia_chi: Optional[str] = None

# Schema quên mật khẩu
class ForgotPassword(BaseModel):
    email: EmailStr

# Schema phản hồi quên mật khẩu
class ForgotPasswordResponse(BaseModel):
    message: str
    mat_khau:str
    class Config:
        from_attributes = True

# Schema đổi mật khẩu
class ChangePassword(BaseModel):
    oldpassword: str
    newpassword: str

# Schema phản hồi đổi mật khẩu
class ChangePasswordResponse(BaseModel):
    message: str
    class Config:
        from_attributes = True


class HistoryFilm(BaseModel): 
    lich_chieu: date 
    phong_chieu: str
    ghe: int
    tong_tien: int 
    
    class Config: 
        from_attributes = True 






# Schema ghế
class GheResponse(BaseModel):
    id: int
    so_ghe: str
    loai_ghe: str
    gia: int
    trang_thai: str
    
    class Config:
        from_attributes = True

# chọn ghế
class ChonGhe(BaseModel):
    suat_chieu_id: int
    ghe_ids: List[int]
    user_id: int
    


 # thanh toán : 

# Schema cho request của endpoint confirm_and_pay
class ThanhToanRequest(BaseModel):
    suat_chieu_id: int
    ghe_ids: List[int]
    user_id: int
    phuong_thuc_thanh_toan: str
    tong_gia: float

    class Config:
        from_attributes = True
class ThanhToanBase(BaseModel):
    id: int
    phuong_thuc: str
    trang_thai: str
    ngay_thanh_toan: Optional[date] = None
    so_tien: float
    ma_giao_dich: Optional[str] = None

    class Config:
        from_attributes = True






# Schema cho response của endpoint confirm_and_pay
class TicketResponse(BaseModel):
    ve_ids: List[int]
    ten_phim: str
    ngay_chieu: str  # Định dạng "YYYY-MM-DD"
    gio_bat_dau: str  # Định dạng "HH:MM"
    phong: str
    ghe: List[str]
    tong_gia: float
    trang_thai: str
    ma_giao_dich: str

    class Config:
        from_attributes = True


# Schema cho request khi tạo bình luận
class BinhLuanRequest(BaseModel):
    phim_id: int
    noi_dung: str
    danh_gia: Optional[int] = None  # Không bắt buộc vì có thể chỉ bình luận mà không đánh giá sao

# Schema cho response khi lấy bình luận
class BinhLuanResponse(BaseModel):
    id: int
    user_id: int
    phim_id: int
    noi_dung: str
    danh_gia: Optional[int] = None
    ngay_binh_luan: datetime

# Schema cho response danh sách bình luận và đánh giá trung bình
class DanhGiaResponse(BaseModel):
    phim_id: int
    danh_gia_trung_binh: float
    binh_luan: list[BinhLuanResponse]








# tìm kiếm film 
class SearchFilmRequest(BaseModel):
    request: str 
class SearchFilmResponse(BaseModel):
    title: str
    image: Optional[str] = None
    category: Optional[str] = None
    trailer: Optional[str] = None  
    rank : float
    
    class Config:
        from_attributes = True






class LichSuPhimResponse(BaseModel):
    ten_phim: str
    anh_phim: str
    danh_sach_ghe: List[str]
    phong_chieu: str
    ngay_chieu: date
    gio_bat_dau: time
    gio_ket_thuc: time
    so_tien: float  # Thêm trường số tiền thanh toán
    ma_giao_dich: Optional[str] = None

    class Config:
        from_attributes = True  # Cho phép ánh xạ từ ORM object (Pydantic v1)



# Schema cho ThanhToan (nếu cần)


