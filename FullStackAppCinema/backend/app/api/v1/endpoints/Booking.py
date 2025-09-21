from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.Database import get_db
from app.services.Booking import get_phim_full
from app.schemas.SchemaBooking import PhimResponse 

router = APIRouter(tags=["Full service Film"])

@router.get("/phim/{phim_id}", response_model=PhimResponse)
async def booking(phim_id: int, db: AsyncSession = Depends(get_db)):
    return await get_phim_full(phim_id, db)

# @router.get("/phim-upcoming/{phim_id}", response_model=PhimResponseupcoming)
# async def booking(phim_id: int, db: AsyncSession = Depends(get_db)):
#     return await get_phim_upcoming(phim_id, db)
