from fastapi import APIRouter, Depends, HTTPException 
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.Database import get_db
from app.schemas.SchemaHistoryPayment import HistoryPayment
from app.services.historypayment import get_history_payment

router =APIRouter( prefix="/historypayment", tags=["Lich Su Thanh Toan"])

@router.get("/{user_id}" , response_model=list[HistoryPayment])

async def historiespayment (user_id : int , db:AsyncSession = Depends(get_db)): 
    try: 
        return await get_history_payment(user_id , db)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))