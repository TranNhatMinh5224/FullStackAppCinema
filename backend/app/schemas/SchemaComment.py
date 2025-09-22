from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict
class CreateComment(BaseModel):
    phim_id: int
    user_id: int
    noi_dung: str
    danh_gia: int

# Dùng khi cập nhật bình luận
class CommentUpdate(BaseModel):
    noi_dung: str
    danh_gia: int

# Dùng khi hiển thị chi tiết 1 bình luận
class Comment(BaseModel): 
    id: int
    phim_id: int
    ten_tk: str
    binh_luan: str
    thoi_gian: datetime

    class Config:
        from_attributes = True

# Dùng cho khi trả về sau khi người dùng tạo bình luận
class PostComment(BaseModel):
    id: int
    phim_id: int
    user_id: int
    noi_dung: str
    danh_gia: int
    thoi_gian: datetime

    class Config:
        from_attributes = True

# Dùng cho đánh giá tổng hợp
class Rating(BaseModel):
    sum_rating: int                  # Tổng lượt đánh giá
    avg_rating: float                # Trung bình đánh giá
    thong_ke: Dict[int, int]         # {số sao: số lượng}

# Dùng cho response trả về toàn bộ bình luận + thống kê
class ResponseComment(BaseModel):
    comment: List[Comment]
    rating: Rating

    class Config:
        from_attributes = True