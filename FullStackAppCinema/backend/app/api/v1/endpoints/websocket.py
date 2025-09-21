from fastapi import APIRouter, WebSocket
from typing import List

router = APIRouter()

# Danh sách các kết nối WebSocket
active_connections: List[WebSocket] = []

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    
    try:
        while True:
            data = await websocket.receive_text()
            # Echo lại cho client hiện tại
            await websocket.send_text(f"Message received: {data}")
            
            # Broadcast cho tất cả client khác (tùy chọn)
            for connection in active_connections:
                if connection != websocket:
                    await connection.send_text(f"Broadcast: {data}")
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        active_connections.remove(websocket)
