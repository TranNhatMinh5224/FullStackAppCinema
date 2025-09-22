from fastapi import APIRouter , Depends 
from app.schemas.schemas import SearchFilmRequest , SearchFilmResponse
from sqlalchemy.ext.asyncio import AsyncSession 
from typing import List
from app.database.Database import get_db
from app.services.FilmSearch import search_film_service


router = APIRouter(tags=["Tìm kiếm Phim"])
@router.post("/search-film" , response_model= List[SearchFilmResponse])
async def searchfilm(request: SearchFilmRequest , db : AsyncSession=Depends(get_db)):
   return await search_film_service(request, db)