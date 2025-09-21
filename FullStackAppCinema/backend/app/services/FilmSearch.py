from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from sqlalchemy.future import select
from sqlalchemy.sql.expression import func, desc
from app.models.models import Phim
from app.schemas.schemas import SearchFilmRequest, SearchFilmResponse

async def search_film_service(search_film: SearchFilmRequest, db: AsyncSession):
    search_text = search_film.request.lower()  # Chuyển query thành chữ thường
    
    result = await db.execute(
        select(
            func.greatest(
                func.similarity(func.lower(Phim.ten_phim), search_text),
                func.similarity(func.lower(Phim.the_loai), search_text)
            ).label("rank"),
            Phim.ten_phim,
            Phim.hinh_anh,
            Phim.the_loai,
            Phim.trailer
        )
        .where(
            (func.similarity(func.lower(Phim.ten_phim), search_text) > 0.2) |  
            (func.similarity(func.lower(Phim.the_loai), search_text) > 0.2)  # Thêm ngưỡng similarity
        )
        .order_by(desc("rank"))  
        .limit(10)
    )

    films = result.all()
    
    if not films:
        raise HTTPException(status_code=404, detail="Không có phim nào!")
    return [
        SearchFilmResponse(
            rank=rank, 
            title=ten, 
            image=img, 
            category=tl, 
            trailer=trailer 
        ) 
        for rank, ten, img, tl, trailer in films
    ]
