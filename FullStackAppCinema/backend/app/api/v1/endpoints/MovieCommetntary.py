from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.Database import get_db
from app.schemas.schemas import BinhLuanRequest, DanhGiaResponse
from app.services.FilmCommentary import tao_binh_luan, lay_binh_luan

router = APIRouter(prefix="/binh-luan", tags=["Bình luận"])

@router.post("/", response_model=dict)
async def tao_binh_luan_endpoint(user_id: int, request: BinhLuanRequest, db: AsyncSession = Depends(get_db)):
    """
    Endpoint để tạo bình luận cho phim.
    """
    try:
        return await tao_binh_luan(user_id, request, db)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{phim_id}", response_model=DanhGiaResponse)
async def lay_binh_luan_endpoint(phim_id: int, db: AsyncSession = Depends(get_db)):
    """
    Endpoint để lấy danh sách bình luận và điểm trung bình đánh giá của một phim.
    """
    try:
        return await lay_binh_luan(phim_id, db)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
