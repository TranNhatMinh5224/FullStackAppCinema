from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.Database import get_db
from app.services.film import list_film_showing, list_film_upcoming ,add_film,update_phim   , delete_film 
from app.schemas.SchemaFilm import PhimSimpleResponse ,AddFilmResponse , PhimUpdateSchema , AddFilm , DeleteFilmResponse


from typing import List

router = APIRouter(
    prefix="/films",
    tags=["Phim"]
)

#  Lấy danh sách phim đang chiếu
@router.get("/showing", response_model=List[PhimSimpleResponse])
async def get_films_showing(db: AsyncSession = Depends(get_db)):
    return await list_film_showing(db)

#  Lấy danh sách phim sắp chiếu

@router.get("/upcoming", response_model=List[PhimSimpleResponse])
async def get_films_upcoming(db: AsyncSession = Depends(get_db)):
    return await list_film_upcoming(db)
@router.post("/", response_model=AddFilmResponse)
async def create_film(film_data: AddFilm, db: AsyncSession = Depends(get_db)):
    return await add_film(film_data, db)

#  Xóa phim
@router.delete("/{id_film}", response_model=DeleteFilmResponse)
async def remove_film(id_film: int, db: AsyncSession = Depends(get_db)):
    return await delete_film(id_film, db)

@router.put("/{phim_id}", response_model=PhimUpdateSchema)
async def cap_nhat_phim(phim_id: int, phim_data: PhimUpdateSchema, db: AsyncSession = Depends(get_db)):
    return await update_phim(phim_id, phim_data, db)



