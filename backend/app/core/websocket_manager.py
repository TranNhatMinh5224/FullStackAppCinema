from fastapi import WebSocket
from typing import Dict, List, Tuple

class ConnectionManager:
    def __init__(self):
        # Cấu trúc: {suat_chieu_id: [(WebSocket, user_id)]}
        self.active_connections: Dict[int, List[Tuple[WebSocket, int]]] = {}

    async def connect(self, suat_chieu_id: int, user_id: int, websocket: WebSocket):
        await websocket.accept()
        if suat_chieu_id not in self.active_connections:
            self.active_connections[suat_chieu_id] = []
        self.active_connections[suat_chieu_id].append((websocket, user_id))

    def disconnect(self, suat_chieu_id: int, websocket: WebSocket):
        if suat_chieu_id in self.active_connections:
            self.active_connections[suat_chieu_id] = [
                conn for conn in self.active_connections[suat_chieu_id] if conn[0] != websocket
            ]
            if not self.active_connections[suat_chieu_id]:
                del self.active_connections[suat_chieu_id]

    async def broadcast(self, suat_chieu_id: int, message: dict):
        if suat_chieu_id in self.active_connections:
            for connection, _ in self.active_connections[suat_chieu_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

    async def send_personal_message(self, websocket: WebSocket, message: dict):
        try:
            await websocket.send_json(message)
        except Exception:
            pass

manager = ConnectionManager()
