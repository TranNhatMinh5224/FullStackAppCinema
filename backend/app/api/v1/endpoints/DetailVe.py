from fastapi import FastAPI, Depends, HTTPException , APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.Database import get_db
from app.schemas.SchemaVeDetail import VeDetailResponse
from app.services.DetailVe import get_all_ve_details

router = APIRouter()

@router.get("/Ve-Detail-user/{user_id}")
async def get_ve_moi_nhat_endpoint(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    return await get_all_ve_details(user_id, db)