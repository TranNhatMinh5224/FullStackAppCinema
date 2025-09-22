# app/routers/comment_router.py
from fastapi import APIRouter, Depends ,Query

from sqlalchemy.ext.asyncio import AsyncSession
from app.database.Database import get_db
from app.schemas.SchemaComment import (
    CreateComment, CommentUpdate, ResponseComment, PostComment
)
from app.services.CommentFilm import (
    post_comment, update_comment, delete_comment, get_comments
)

router = APIRouter(prefix="/binhluan", tags=["Bình luận"])

@router.post("/", response_model=PostComment)
async def create_comment(data: CreateComment, db: AsyncSession = Depends(get_db)):
    return await post_comment(data, db)

@router.put("/{comment_id}")
async def put_comment(
    comment_id: int,
    data: CommentUpdate,
    user_id: int = Query(..., description="ID người dùng thực hiện cập nhật"),
    db: AsyncSession = Depends(get_db),
):
    return await update_comment(comment_id, user_id, data, db)

# Xóa bình luận (phải đúng người tạo)
@router.delete("/{comment_id}")
async def remove_comment(
    comment_id: int,
    user_id: int = Query(..., description="ID người dùng thực hiện xóa"),
    db: AsyncSession = Depends(get_db),
):
    return await delete_comment(comment_id, user_id, db)


@router.get("/{phim_id}", response_model=ResponseComment)
async def get_all_comment(phim_id: int, db: AsyncSession = Depends(get_db)):
    return await get_comments(phim_id, db)
