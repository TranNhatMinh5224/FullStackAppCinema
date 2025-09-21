
# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy.future import select
# from app.database.Database import get_db
# from app.models.taikhoan import Taikhoan 

# router = APIRouter()

# @router.get("/check-db")
# async def check_database_connection(db: AsyncSession = Depends(get_db)):
#     try:
#         # Kiểm tra bằng cách lấy 1 bản ghi từ bảng TaiKhoan (có thể đổi thành bảng khác)
#         result = await db.execute(select(Taikhoan).limit(1))
#         user = result.scalars().first()
#         return {"status": "success", "message": "Kết nối database thành công!", "sample_user": user}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Lỗi kết nối database: {str(e)}")
