from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.schemas import ChonGhe 
from app.database.Database import get_db
from app.services.ChooseChair import select_seats , DeleteSelectedSeats

router = APIRouter(tags=["chọn ghế"])

@router.post("/chon-ghe", response_model=None)
async def select_seats_endpoint(request: ChonGhe, db: AsyncSession = Depends(get_db)):
    return await select_seats(request.suat_chieu_id, request.ghe_ids, request.user_id, db)
@router.delete("/xoa-ghe", response_model=None)
async def delete_selected_seats_endpoint(request: ChonGhe, db: AsyncSession = Depends(get_db)):
    return await DeleteSelectedSeats (request.suat_chieu_id, request.ghe_ids, request.user_id, db)