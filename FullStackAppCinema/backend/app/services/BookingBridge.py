from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.redis.redis import redis_manager
from app.models.models import Ve, ThanhToan
from sqlalchemy.future import select
from fastapi import HTTPException
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class BookingBridge:
    @staticmethod
    async def create_pending_order(db: AsyncSession, order_code: int, user_id: int, showtime_id: int, seat_ids: list[int], amount: int, hold_ttl=900):
        """
        Tạo đơn PENDING và giữ ghế trong Redis
        """
        try:
            # 1) Lưu đơn PENDING vào bảng payos_orders
            await db.execute(text("""
                INSERT INTO payos_orders (order_code, user_id, suat_chieu_id, ghe_ids, tong_gia, created_at)
                VALUES (:oc, :uid, :scid, :gids, :amt, NOW())
                ON CONFLICT (order_code) DO UPDATE SET
                    user_id = EXCLUDED.user_id,
                    suat_chieu_id = EXCLUDED.suat_chieu_id,
                    ghe_ids = EXCLUDED.ghe_ids,
                    tong_gia = EXCLUDED.tong_gia
            """), {
                "oc": order_code,
                "uid": user_id,
                "scid": showtime_id,
                "gids": ','.join(map(str, seat_ids)),
                "amt": amount
            })
            await db.commit()

            # 2) GIỮ GHẾ TẠM trong Redis để UI thấy ghế bị giữ
            for seat_id in seat_ids:
                success = await redis_manager.set_ghe_tam_thoi(
                    suat_chieu_id=showtime_id,
                    ghe_id=seat_id,
                    user_id=user_id,
                    timeout=hold_ttl
                )
                if not success:
                    logger.warning(f"Ghế {seat_id} đã được giữ bởi người khác")
                    # Không throw error, chỉ log warning

            logger.info(f"✅ Created pending order {order_code} with {len(seat_ids)} seats")
            return True

        except Exception as e:
            logger.error(f"Error creating pending order: {e}")
            raise HTTPException(status_code=500, detail=f"Error creating pending order: {str(e)}")

    @staticmethod
    async def finalize_paid_order(db: AsyncSession, order_code: int, transaction_code: str = None):
        """
        Chốt đơn PENDING → PAID và tạo vé chính thức
        """
        try:
            # 1) Lấy đơn PENDING
            result = await db.execute(text("""
                SELECT user_id, suat_chieu_id, ghe_ids, tong_gia
                FROM payos_orders 
                WHERE order_code = :oc
            """), {"oc": order_code})
            
            order_data = result.fetchone()
            if not order_data:
                return False, "ORDER_NOT_FOUND"

            user_id = order_data.user_id
            suat_chieu_id = order_data.suat_chieu_id
            ghe_ids = [int(x) for x in order_data.ghe_ids.split(',')]
            tong_gia = order_data.tong_gia

            logger.info(f"Finalizing order {order_code}: user_id={user_id}, suat_chieu_id={suat_chieu_id}, ghe_ids={ghe_ids}")

            # 2) Gọi service checkout cũ để tạo vé đúng cách
            from app.services.payment import confirm_and_pay
            
            result = await confirm_and_pay(
                suat_chieu_id=suat_chieu_id,
                ghe_ids=ghe_ids,
                user_id=user_id,
                phuong_thuc="PayOS",
                tong_gia=tong_gia,
                db=db
            )

            # 3) Xóa đơn PENDING khỏi payos_orders
            await db.execute(text("DELETE FROM payos_orders WHERE order_code = :oc"), {"oc": order_code})
            await db.commit()

            logger.info(f"✅ Finalized order {order_code} with transaction {result.ma_giao_dich}")
            return True, result.ma_giao_dich

        except Exception as e:
            logger.error(f"Error finalizing order {order_code}: {e}")
            return False, str(e)

