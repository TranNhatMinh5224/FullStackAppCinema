
from sqlalchemy.ext.asyncio import AsyncSession 
from sqlalchemy.future import select
from fastapi import HTTPException
from sqlalchemy.orm import joinedload
from sqlalchemy import func

from app.models.models import BinhLuan, Phim, Ve, TaiKhoan
from app.schemas.SchemaComment import (
    ResponseComment, Rating, CommentUpdate, CreateComment, Comment, PostComment
)

async def get_comments(phim_id: int, db: AsyncSession):
    # Kiểm tra phim có tồn tại không
    result = await db.execute(select(Phim).where(Phim.id == phim_id))
    phim = result.scalar_one_or_none()
    if not phim:
        raise HTTPException(status_code=404, detail="Phim không tồn tại")

    # Lấy danh sách bình luận kèm thông tin người dùng
    result = await db.execute(
        select(BinhLuan)
        .options(joinedload(BinhLuan.user))
        .where(BinhLuan.phim_id == phim_id)
    )
    comments = result.scalars().all()

    # Tạo danh sách comment trả về
    comment_data = [
        Comment(
            id=bl.id,
            phim_id=bl.phim_id,
            ten_tk=bl.user.ten,
            binh_luan=bl.noi_dung,
            thoi_gian=bl.ngay_binh_luan
        ) for bl in comments
    ]

    # Thống kê đánh giá: tổng số và trung bình
    result_rating = await db.execute(
        select(
            func.count(BinhLuan.danh_gia),
            func.avg(BinhLuan.danh_gia)
        ).where(BinhLuan.phim_id == phim_id)
    )
    sum_rating, avg_rating = result_rating.fetchone()

    # Thống kê số lượng từng mức đánh giá (1 -> 5 sao)
    result_stat = await db.execute(
        select(BinhLuan.danh_gia, func.count(BinhLuan.danh_gia))
        .where(BinhLuan.phim_id == phim_id)
        .group_by(BinhLuan.danh_gia)
    )
    thong_ke = {row[0]: row[1] for row in result_stat.fetchall()}

    return ResponseComment(
        comment=comment_data,
        rating=Rating(
            sum_rating=sum_rating or 0,
            avg_rating=round(avg_rating or 0.0, 2),
            thong_ke=thong_ke
        )
    )


async def post_comment(data: CreateComment, db: AsyncSession) -> PostComment:
    # Kiểm tra phim
    result = await db.execute(select(Phim).where(Phim.id == data.phim_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Phim không tồn tại")

    # Kiểm tra tài khoản
    result = await db.execute(select(TaiKhoan).where(TaiKhoan.id == data.user_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Tài khoản không tồn tại")


    # Tạo mới bình luận
    comment = BinhLuan(
        phim_id=data.phim_id,
        user_id=data.user_id,
        noi_dung=data.noi_dung,
        danh_gia=data.danh_gia
    )
    db.add(comment)
    await db.commit()
    await db.refresh(comment)

    return PostComment(
        id=comment.id,
        phim_id=comment.phim_id,
        user_id=comment.user_id,
        noi_dung=comment.noi_dung,
        danh_gia=comment.danh_gia,
        thoi_gian=comment.ngay_binh_luan
    )

async def update_comment(comment_id: int, data: CommentUpdate, db: AsyncSession):
    # Tìm bình luận theo ID
    result = await db.execute(select(BinhLuan).where(BinhLuan.id == comment_id))
    comment = result.scalar_one_or_none()
    if not comment:
        raise HTTPException(status_code=404, detail="Không tìm thấy bình luận")

    # Kiểm tra xem user gửi yêu cầu có đúng là người viết bình luận hay không
    if comment.user_id != data.user_id:
        raise HTTPException(status_code=403, detail="Bạn không có quyền chỉnh sửa bình luận này")

    # Cập nhật nội dung
    comment.noi_dung = data.noi_dung
    comment.danh_gia = data.danh_gia
    await db.commit()
    return {"message": "Cập nhật bình luận thành công"}
async def delete_comment(comment_id: int, user_id: int, db: AsyncSession):
    result = await db.execute(select(BinhLuan).where(BinhLuan.id == comment_id))
    comment = result.scalar_one_or_none()
    if not comment:
        raise HTTPException(status_code=404, detail="Không tìm thấy bình luận")

    if comment.user_id != user_id:
        raise HTTPException(status_code=403, detail="Bạn không có quyền xóa bình luận này")

    await db.delete(comment)
    await db.commit()
    return {"message": "Xóa bình luận thành công"}