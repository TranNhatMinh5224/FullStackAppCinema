from fastapi import APIRouter , Depends ,HTTPException
from sqlalchemy.ext.asyncio import AsyncSession 
from app.database.Database import  get_db 
from app.schemas.schemas import GheResponse
from app.services.ChairList import list_ghe
from typing import List

router = APIRouter(prefix="/listghe", tags=["Danh sách ghế"])


@router.get("/ghe/{suat_chieu_id}", response_model=List[GheResponse])
async def get_list_ghe(suat_chieu_id: int, db: AsyncSession = Depends(get_db)):
    return await list_ghe(suat_chieu_id, db)