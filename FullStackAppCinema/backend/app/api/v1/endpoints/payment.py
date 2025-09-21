from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.Database import get_db
from app.services.payment import confirm_and_pay
from app.schemas.schemas import ThanhToanRequest, TicketResponse 

router = APIRouter(prefix="/Payment" , tags= ["Thanh toán vé"])



@router.post("/confirm", response_model=TicketResponse)
async def confirm_and_pay_endpoint(request: ThanhToanRequest, db: AsyncSession = Depends(get_db)):

    return await confirm_and_pay(
        suat_chieu_id=request.suat_chieu_id,
        ghe_ids=request.ghe_ids,
        user_id=request.user_id,
        phuong_thuc=request.phuong_thuc_thanh_toan,
        tong_gia=request.tong_gia,
        db=db
    )
    
    #/Payment/confirm