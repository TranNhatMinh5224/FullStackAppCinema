from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.schemas import ChonGhe 
from app.database.Database import get_db
from app.services.UpdateChair import update_seats


router = APIRouter(tags=["Update Chair"])

@router.put("/update-ghe", response_model=None)
async def update_seats_endpoint(request: ChonGhe, db: AsyncSession = Depends(get_db)):
    return await update_seats(request.suat_chieu_id, request.ghe_ids, request.user_id, db)
