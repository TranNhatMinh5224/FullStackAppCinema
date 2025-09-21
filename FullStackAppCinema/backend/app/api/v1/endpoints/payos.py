from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse
from app.services.PayOSService import payos_service
from app.database.Database import get_db
from app.models.models import Ve, ThanhToan
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from pydantic import BaseModel
from typing import List, Optional
import logging
from datetime import datetime
import random
import json

router = APIRouter()
logger = logging.getLogger(__name__)

class PayOSPaymentRequest(BaseModel):
    productName: str
    price: int
    description: str
    returnUrl: str
    cancelUrl: str
    userId: int              # THÊM
    showtimeId: int          # THÊM
    seatIds: List[int]       # THÊM

@router.post("/order/create")
async def create_payment_link(request: PayOSPaymentRequest, db: AsyncSession = Depends(get_db)):
    """
    Tạo payment link PayOS và tạo order PENDING + ghế tạm
    """
    try:
        logger.info(f"Creating payment link: {request}")

        # Validate price
        if not isinstance(request.price, int) or request.price < 1000:
            raise HTTPException(status_code=400, detail="price phải là số nguyên >= 1000 VND")

        # 1) Tạo order_code số duy nhất
        order_code = int(datetime.now().strftime("%Y%m%d%H%M%S"))
        logger.info(f"Generated order_code: {order_code}")

        # 2) Tạo đơn PENDING và giữ ghế
        try:
            from app.services.BookingBridge import BookingBridge
            
            await BookingBridge.create_pending_order(
                db=db,
                order_code=order_code,
                user_id=request.userId,
                showtime_id=request.showtimeId,
                seat_ids=request.seatIds,
                amount=request.price,
                hold_ttl=900  # 15 phút
            )
            
            logger.info(f"✅ Created pending order {order_code} with {len(request.seatIds)} seats")
            
        except Exception as bridge_error:
            logger.error(f"Error creating pending order: {bridge_error}")
            raise HTTPException(status_code=400, detail=f"Không thể tạo đơn: {str(bridge_error)}")

        # 3) Gọi PayOS tạo link
        result = payos_service.create_payment_link(
            product_name=request.productName,
            price=request.price,
            description=request.description,
            return_url=request.returnUrl,
            cancel_url=request.cancelUrl,
            booking_data={
                "orderCode": order_code,
                "userId": request.userId,
                "showtimeId": request.showtimeId,
                "seatIds": request.seatIds
            }
        )

        if result.get("error") == 0:
            return {
                "error": 0,
                "message": "OK",
                "data": {
                    "checkoutUrl": result["data"].get("checkout_url") or result["data"].get("checkoutUrl"),
                    "orderCode": order_code
                }
            }
        else:
            raise HTTPException(status_code=500, detail=result.get("message", "Create payment error"))

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in create_payment_link: {e}")
        return {
            "error": 1,
            "message": str(e),
            "data": None
        }

@router.get("/return")
async def payos_return(
    code: str = None,
    desc: str = None,
    data: str = None,
    signature: str = None,
    user_id: str = None,
    suat_chieu_id: str = None,
    ghe_ids: str = None,
    tong_gia: str = None,
    order_code: str = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Xử lý khi PayOS redirect về sau khi thanh toán
    """
    try:
        logger.info(f"PayOS return: code={code}, desc={desc}")
        logger.info(f"Booking params: user_id={user_id}, suat_chieu_id={suat_chieu_id}, ghe_ids={ghe_ids}, order_code={order_code}")
        
        if code == "00":  # Thanh toán thành công
            # Chốt đơn PENDING → PAID
            try:
                from app.services.BookingBridge import BookingBridge
                
                logger.info(f"Finalizing order {order_code} after successful payment")
                
                # Chốt đơn và tạo vé
                success, result = await BookingBridge.finalize_paid_order(
                    db=db,
                    order_code=int(order_code) if order_code else 0,
                    transaction_code=f"TXN_{order_code}"
                )
                
                if success:
                    logger.info(f"✅ Order {order_code} finalized successfully: {result}")
                    
                    # Redirect về app với thông tin vé
                    return RedirectResponse(
                        url=f"exp://192.168.1.11:8081/--/PaymentSuccess?paymentMethod=PayOS&success=true&orderCode={order_code}&maGiaoDich={result}"
                    )
                else:
                    logger.error(f"Failed to finalize order {order_code}: {result}")
                    return RedirectResponse(
                        url=f"exp://192.168.1.11:8081/--/PaymentFail?errorMessage=Lỗi chốt đơn: {result}"
                    )
                
            except Exception as e:
                logger.error(f"Error finalizing order: {e}")
                return RedirectResponse(
                    url=f"exp://192.168.1.11:8081/--/PaymentFail?errorMessage=Lỗi chốt đơn: {str(e)}"
                )
        else:
            # Thanh toán thất bại
            return RedirectResponse(
                url="exp://192.168.1.11:8081/--/PaymentFail?errorMessage=Thanh toán thất bại!"
            )

    except Exception as e:
        logger.error(f"Error in payos_return: {e}")
        return RedirectResponse(
            url="exp://192.168.1.11:8081/--/PaymentFail?errorMessage=Có lỗi xảy ra!"
        )

@router.post("/order/confirm/{order_code}")
async def confirm_order(order_code: int, db: AsyncSession = Depends(get_db)):
    """
    Frontend gọi endpoint này sau khi PayOS redirect về
    """
    try:
        logger.info(f"Confirming order {order_code}")
        
        # Hỏi lại PayOS để xác nhận trạng thái
        info = payos_service.get_payment_link_information(order_code)
        if info is None or not isinstance(info, dict):
            raise HTTPException(status_code=400, detail="Cannot get payment information from PayOS")
            
        code = info.get("code")
        data = info.get("data", {})
        status = data.get("status") if data else None
        txn = data.get("transactionCode") if data else None
        
        logger.info(f"PayOS status check: code={code}, status={status}, txn={txn}")
        
        if code == "00" or status in ("PAID", "SUCCEEDED", "SUCCESS"):
            # Chốt đơn PENDING → PAID
            from app.services.BookingBridge import BookingBridge
            
            success, result = await BookingBridge.finalize_paid_order(
                db=db,
                order_code=order_code,
                transaction_code=txn
            )
            
            if success:
                return {"ok": True, "ma_giao_dich": result}
            else:
                raise HTTPException(status_code=400, detail=result)
        else:
            raise HTTPException(status_code=400, detail=f"NOT_PAID status={status} code={code}")
            
    except Exception as e:
        logger.error(f"Error confirming order {order_code}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def payos_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    PayOS webhook để xử lý thanh toán thành công - chốt vé PENDING → PAID
    """
    try:
        # Lấy raw body
        body = await request.body()
        data = json.loads(body)
        
        logger.info(f"PayOS webhook received: {data}")
        
        code = data.get("code")        # "00" là thành công
        order_code = int(data.get("orderCode"))
        txn_code = data.get("transactionCode")
        amount = int(data.get("amount", 0))
        
        if code != "00":
            logger.warning(f"Thanh toán thất bại: {code}")
            return {"success": False, "message": "Payment failed"}

        # 1) Lấy booking data từ URL params (được truyền từ returnUrl)
        try:
            # Lấy params từ request URL
            user_id = int(request.query_params.get('user_id', 30))
            suat_chieu_id = int(request.query_params.get('suat_chieu_id', 123))
            ghe_ids_str = request.query_params.get('ghe_ids', '800,801')
            ghe_ids = [int(x) for x in ghe_ids_str.split(',')]
            tong_gia = amount
            
            logger.info(f"Found booking data from URL: user_id={user_id}, suat_chieu_id={suat_chieu_id}, ghe_ids={ghe_ids}")
            
            # 2) Gọi service checkout cũ để tạo vé đúng cách
            from app.services.payment import confirm_and_pay
            
            logger.info(f"Calling checkout service for order {order_code}")
            
            # Gọi service checkout cũ
            result = await confirm_and_pay(
                suat_chieu_id=suat_chieu_id,
                ghe_ids=ghe_ids,
                user_id=user_id,
                phuong_thuc="PayOS",
                tong_gia=tong_gia,
                db=db
            )
            
            logger.info(f"✅ Checkout service completed for order {order_code}")
            return {"success": True, "message": f"Tạo vé thành công: {result.ma_giao_dich}"}
            
        except Exception as checkout_error:
            logger.error(f"Error calling checkout service: {checkout_error}")
            return {"success": False, "message": f"Checkout error: {str(checkout_error)}"}
            
    except Exception as e:
        logger.error(f"Error in webhook: {e}")
        logger.error(f"Error type: {type(e)}")
        logger.error(f"Error details: {e.args}")
        return {"success": False, "message": "Webhook error"}

@router.post("/confirm/{order_code}")
async def payos_confirm(order_code: str, db: AsyncSession = Depends(get_db)):
    """
    PayOS confirm - frontend gọi sau khi redirect về app
    Chốt vé PENDING → PAID và trả về thông tin vé
    """
    try:
        logger.info(f"PayOS confirm: {order_code}")
        
        # Tìm tất cả vé PENDING theo order_code
        from sqlalchemy import select
        result = await db.execute(
            select(Ve).where(Ve.ma_giao_dich == str(order_code), Ve.trang_thai == "PENDING")
        )
        pending_ves = result.scalars().all()
        
        logger.info(f"Found {len(pending_ves)} pending tickets for order {order_code}")
        
        if not pending_ves:
            return {
                "error": 1,
                "message": "No pending tickets found",
                "data": None
            }
        
        # Cập nhật tất cả vé PENDING → PAID
        for ve in pending_ves:
            ve.trang_thai = "Đã thanh toán"
        
        await db.commit()
        
        logger.info(f"✅ Đã chốt {len(pending_ves)} vé từ PENDING → PAID cho order {order_code}")
        
        # Trả về thông tin vé đã chốt
        ve_data = []
        for ve in pending_ves:
            ve_data.append({
                "id": ve.id,
                "ma_giao_dich": ve.ma_giao_dich,
                "trang_thai": ve.trang_thai,
                "gia_ve": ve.gia_ve,
                "user_id": ve.user_id,
                "suat_chieu_id": ve.suat_chieu_id,
                "ghe_id": ve.ghe_id
            })
        
        return {
            "error": 0,
            "message": "Payment confirmed successfully",
            "data": {
                "order_code": order_code,
                "tickets": ve_data,
                "total_tickets": len(ve_data)
            }
        }
        
    except Exception as e:
        logger.error(f"Error in payos_confirm: {e}")
        logger.error(f"Error type: {type(e)}")
        logger.error(f"Error details: {e.args}")
        return {
            "error": 1,
            "message": f"Confirm error: {str(e)}",
            "data": None
        }

@router.get("/order/{order_code}")
async def get_order(order_code: str, db: AsyncSession = Depends(get_db)):
    """
    Lấy thông tin order như demo
    """
    try:
        logger.info(f"Getting order: {order_code}")
        
        # Tìm vé theo order_code trong trang_thai
        result = await db.execute(text("""
            SELECT id, user_id, suat_chieu_id, ghe_id, gia_ve, trang_thai
            FROM ve 
            WHERE trang_thai LIKE :status_pattern
        """), {"status_pattern": f"%{order_code}%"})
        ves = result.fetchall()
        
        logger.info(f"Found {len(ves)} tickets for order {order_code}")
        
        if ves:
            ve_data = []
            for ve in ves:
                ve_data.append({
                    "id": ve.id,
                    "trang_thai": ve.trang_thai,
                    "gia_ve": float(ve.gia_ve) if ve.gia_ve else 0,
                    "user_id": ve.user_id,
                    "suat_chieu_id": ve.suat_chieu_id,
                    "ghe_id": ve.ghe_id
                })
            
            return {
                "error": 0,
                "message": "Success",
                "data": {
                    "order_code": order_code,
                    "tickets": ve_data,
                    "total_tickets": len(ve_data)
                }
            }
        else:
            logger.warning(f"No tickets found for order {order_code}")
            return {
                "error": 1,
                "message": "Order not found",
                "data": None
            }
            
    except Exception as e:
        logger.error(f"Error getting order: {e}")
        logger.error(f"Error type: {type(e)}")
        logger.error(f"Error details: {e.args}")
        return {
            "error": 1,
            "message": f"Error getting order: {str(e)}",
            "data": None
        }
