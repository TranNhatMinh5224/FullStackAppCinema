from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.Database import get_db
from app.services.historyfilm import get_lich_su_phim
from app.schemas.schemas import LichSuPhimResponse
from typing import List

router = APIRouter(tags= ["lich su xem film"])

@router.get("/lich-su-phim/{user_id}", response_model=List[LichSuPhimResponse])
async def lich_su_phim_endpoint(user_id: int, db: AsyncSession = Depends(get_db)):
    return await get_lich_su_phim(user_id, db)