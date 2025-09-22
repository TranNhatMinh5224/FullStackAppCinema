from fastapi import APIRouter, Depends, HTTPException 
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.Database import get_db
from sqlalchemy.future import select 
from sqlalchemy.orm import joinedload 
from app.schemas.SchemaHistoryPayment import HistoryPayment

# from app.schemas.schemas import 
from app.models.models import ThanhToan , Ve , TaiKhoan

async def get_history_payment(user_id_history : int , db:AsyncSession ): 
     query = await db.execute(select(ThanhToan).options(joinedload(ThanhToan.ve)).join(ThanhToan.ve).where(Ve.user_id == user_id_history))
     result = query.unique().scalars().all()
     if not result:
         raise HTTPException(status_code=404, detail="Không tìm thấy lịch sử thanh toán") 
     return [HistoryPayment(
           phuong_thuc= thanh_toan.phuong_thuc,
           trang_thai= thanh_toan.trang_thai,
           ngay_thanh_toan= thanh_toan.ngay_thanh_toan,
           so_tien= thanh_toan.so_tien,
           ma_giao_dich= thanh_toan.ma_giao_dich,
           
     )for thanh_toan in result]     