from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from app.core.websocket_manager import manager
from app.redis.redis import redis_manager
from app.database.Database import AsyncSessionLocal
from app.services.ChooseChair import select_seats, DeleteSelectedSeats
import json

router = APIRouter()

@router.websocket("/ws/{suat_chieu_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, suat_chieu_id: int, user_id: int):
    # Kết nối client vào phòng chiếu tương ứng với suất chiếu
    await manager.connect(suat_chieu_id, user_id, websocket)
    try:
        while True:
            # Nhận tin nhắn từ client dạng text (JSON)
            data_text = await websocket.receive_text()
            try:
                data = json.loads(data_text)
            except json.JSONDecodeError:
                await manager.send_personal_message(websocket, {
                    "event": "ERROR",
                    "message": "Định dạng tin nhắn không hợp lệ, phải là JSON"
                })
                continue

            action = data.get("action")
            ghe_ids = data.get("ghe_ids")

            if not action or not ghe_ids:
                await manager.send_personal_message(websocket, {
                    "event": "ERROR",
                    "message": "Thiếu thông tin action hoặc danh sách ghế (ghe_ids)"
                })
                continue

            # Chuyển ghe_ids về dạng list nếu client gửi một số đơn lẻ
            if not isinstance(ghe_ids, list):
                ghe_ids = [ghe_ids]

            # Xử lý hành động chọn ghế
            if action == "CHOOSE_SEAT":
                async with AsyncSessionLocal() as db:
                    try:
                        # Gọi nghiệp vụ select_seats (đã kiểm tra DB & lưu Redis)
                        await select_seats(suat_chieu_id, ghe_ids, user_id, db)
                        # Broadcast thông báo khóa ghế đến tất cả clients khác trong phòng
                        await manager.broadcast(suat_chieu_id, {
                            "event": "SEATS_LOCKED",
                            "ghe_ids": ghe_ids,
                            "user_id": user_id
                        })
                    except HTTPException as e:
                        # Gửi thông điệp lỗi riêng tư cho client yêu cầu
                        await manager.send_personal_message(websocket, {
                            "event": "ERROR",
                            "message": e.detail
                        })
                    except Exception as e:
                        await manager.send_personal_message(websocket, {
                            "event": "ERROR",
                            "message": str(e)
                        })

            # Xử lý hành động hủy chọn ghế
            elif action == "RELEASE_SEAT":
                async with AsyncSessionLocal() as db:
                    try:
                        # Gọi nghiệp vụ DeleteSelectedSeats (kiểm tra quyền sở hữu và xóa Redis)
                        await DeleteSelectedSeats(suat_chieu_id, ghe_ids, user_id, db)
                        # Broadcast thông báo mở khóa ghế đến tất cả clients trong phòng
                        await manager.broadcast(suat_chieu_id, {
                            "event": "SEATS_RELEASED",
                            "ghe_ids": ghe_ids
                        })
                    except HTTPException as e:
                        await manager.send_personal_message(websocket, {
                            "event": "ERROR",
                            "message": e.detail
                        })
                    except Exception as e:
                        await manager.send_personal_message(websocket, {
                            "event": "ERROR",
                            "message": str(e)
                        })

    except WebSocketDisconnect:
        # Ngắt kết nối socket khỏi manager
        manager.disconnect(suat_chieu_id, websocket)
        # Tự động dọn dẹp toàn bộ ghế đang được giữ bởi user này trên Redis
        ghe_ids_da_xoa = await redis_manager.xoa_ghe_cua_user(suat_chieu_id, user_id)
        # Nếu có ghế bị giải phóng, thông báo cho các clients khác cập nhật giao diện
        if ghe_ids_da_xoa:
            await manager.broadcast(suat_chieu_id, {
                "event": "SEATS_RELEASED",
                "ghe_ids": ghe_ids_da_xoa
            })
