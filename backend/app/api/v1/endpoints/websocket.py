from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import Dict, Set, Any
import json
import asyncio

from app.core.redis_connection import get_redis
from app.redis.redis import redis_manager
from app.database.Database import AsyncSessionLocal
from app.services.payment import confirm_and_pay
from app.models.models import Ghe
from sqlalchemy.future import select

router = APIRouter()

# schedule_id -> set(WebSocket)
connections_by_schedule: Dict[str, Set[WebSocket]] = {}
connections_lock = asyncio.Lock()

# map websocket -> user_id for cleanup on disconnect
ws_user_map: Dict[WebSocket, Any] = {}

# Redis pubsub subscriber task (single per process)
_subscriber_task: asyncio.Task | None = None
_subscriber_started = False
_subscriber_lock = asyncio.Lock()

async def send_safe(ws: WebSocket, data: str):
    try:
        await ws.send_text(data)
    except Exception:
        pass

async def broadcast_local(schedule_id: str, message: Dict[str, Any]):
    """Send message to websockets connected to this schedule on this instance."""
    data = json.dumps(message)
    conns = list(connections_by_schedule.get(schedule_id, set()))
    for ws in conns:
        await send_safe(ws, data)

async def _redis_subscriber_loop():
    """Background task that subscribes to schedule:*:events and forwards to local clients."""
    try:
        redis = await get_redis()
        pubsub = redis.pubsub()
        await pubsub.psubscribe("schedule:*:events")

        async for message in pubsub.listen():
            # message example: { 'type': 'pmessage', 'pattern': b'schedule:*:events', 'channel': b'schedule:123:events', 'data': b'...'}
            try:
                mtype = message.get("type")
                if mtype not in ("pmessage", "message"):
                    continue
                raw_channel = message.get("channel")
                data = message.get("data")
                if raw_channel is None or data is None:
                    continue
                # decode bytes if needed
                if isinstance(raw_channel, (bytes, bytearray)):
                    raw_channel = raw_channel.decode()
                if isinstance(data, (bytes, bytearray)):
                    data = data.decode()
                # extract schedule id from channel name
                # expected format: schedule:{schedule_id}:events
                parts = raw_channel.split(":")
                if len(parts) >= 3 and parts[0] == "schedule":
                    schedule_id = parts[1]
                else:
                    # fallback: try to read schedule_id from payload
                    try:
                        payload_tmp = json.loads(data)
                        schedule_id = str(payload_tmp.get("scheduleId") or payload_tmp.get("suat_chieu_id") or "")
                    except Exception:
                        schedule_id = ""
                if not schedule_id:
                    continue
                try:
                    payload = json.loads(data)
                except Exception:
                    # if data is plain string, wrap
                    payload = {"type":"message","message":data}

                await broadcast_local(schedule_id, payload)
            except Exception:
                # swallow per-message errors to keep subscriber running
                continue
    except asyncio.CancelledError:
        return
    except Exception as e:
        print("Redis subscriber loop error:", e)

async def ensure_subscriber_started():
    global _subscriber_task, _subscriber_started
    async with _subscriber_lock:
        if not _subscriber_started:
            _subscriber_task = asyncio.create_task(_redis_subscriber_loop())
            _subscriber_started = True

# Placeholder dependency for auth - replace with real auth
async def get_current_user(token: str = None):
    return token or "anonymous"

@router.websocket("/ws/seats/{schedule_id}")
async def seat_ws(websocket: WebSocket, schedule_id: str, token: str = None):
    # Accept and register
    await websocket.accept()
    # try to get userId from query params (clients can pass ?userId=123)
    qp_user = websocket.query_params.get('userId') or websocket.query_params.get('token')
    if qp_user is not None:
        # keep as string; later comparisons will coerce
        ws_user_map[websocket] = qp_user
    else:
        ws_user_map[websocket] = None

    # ensure subscriber running
    await ensure_subscriber_started()

    # Register connection
    async with connections_lock:
        connections_by_schedule.setdefault(schedule_id, set()).add(websocket)

    try:
        redis = await get_redis()
        while True:
            text = await websocket.receive_text()
            try:
                msg = json.loads(text)
            except Exception:
                await websocket.send_text(json.dumps({"status": "error", "reason": "invalid_json"}))
                continue

            # if client provides userId in message, update mapping
            if msg.get('userId') is not None:
                ws_user_map[websocket] = msg.get('userId')

            typ = msg.get("type")
            seat_id = msg.get("seatId")
            user_id = msg.get("userId") or ws_user_map.get(websocket) or "anonymous"
            expires = int(msg.get("expires", 120))
            key = f"seat:{schedule_id}:{seat_id}"
            channel = f"schedule:{schedule_id}:events"

            if typ == "lock":
                try:
                    ok = await redis.set(key, user_id, nx=True, ex=expires)
                except Exception:
                    ok = await redis.set(key, user_id, nx=True, ex=expires)
                if ok:
                    # publish event; subscriber will forward to local clients
                    payload = {"type": "locked", "seatId": seat_id, "userId": user_id, "scheduleId": schedule_id}
                    await redis.publish(channel, json.dumps(payload))
                    await websocket.send_text(json.dumps({"status": "ok", "action": "locked", "seatId": seat_id}))
                else:
                    owner = await redis.get(key)
                    await websocket.send_text(json.dumps({"status": "fail", "reason": "locked", "owner": owner}))

            elif typ == "unlock":
                owner = await redis.get(key)
                if owner and str(owner) == str(user_id):
                    await redis.delete(key)
                    payload = {"type": "available", "seatId": seat_id, "scheduleId": schedule_id}
                    await redis.publish(channel, json.dumps(payload))
                    await websocket.send_text(json.dumps({"status": "ok", "action": "unlocked", "seatId": seat_id}))
                else:
                    await websocket.send_text(json.dumps({"status": "fail", "reason": "not_owner"}))

            elif typ == "extend":
                lua = """
                if redis.call('get', KEYS[1]) == ARGV[1] then
                    return redis.call('expire', KEYS[1], ARGV[2])
                else
                    return 0
                end
                """
                try:
                    res = await redis.eval(lua, 1, key, user_id, int(msg.get("extra", 60)))
                except Exception:
                    res = 0
                if res:
                    await websocket.send_text(json.dumps({"status": "ok", "action": "extended", "seatId": seat_id}))
                else:
                    await websocket.send_text(json.dumps({"status": "fail", "reason": "not_owner_or_missing"}))

            elif typ == "confirm":
                ghe_ids = msg.get("gheIds") or ([seat_id] if seat_id else [])
                if not ghe_ids:
                    await websocket.send_text(json.dumps({"status": "fail", "reason": "no_seat_provided"}))
                    continue

                try:
                    total = float(msg.get("tong_gia")) if msg.get("tong_gia") is not None else None
                except Exception:
                    total = None

                if total is None:
                    async with AsyncSessionLocal() as db:
                        total_calc = 0
                        for gid in ghe_ids:
                            result = await db.execute(select(Ghe).where(Ghe.id == int(gid)))
                            seat = result.scalars().first()
                            if not seat:
                                await websocket.send_text(json.dumps({"status": "fail", "reason": f"invalid_seat_{gid}"}))
                                total_calc = None
                                break
                            total_calc += float(seat.gia)
                        total = total_calc

                if total is None:
                    continue

                try:
                    async with AsyncSessionLocal() as db:
                        ticket = await confirm_and_pay(int(schedule_id), [int(g) for g in ghe_ids], int(user_id), msg.get("phuong_thuc", "WS"), float(total), db)
                except Exception as e:
                    await websocket.send_text(json.dumps({"status": "fail", "reason": str(e)}))
                    continue

                # publish reserved event for seats
                for gid in ghe_ids:
                    payload = {"type": "reserved", "seatId": gid, "userId": user_id, "scheduleId": schedule_id}
                    await redis.publish(channel, json.dumps(payload))

                try:
                    payload = ticket.dict()
                except Exception:
                    payload = ticket

                await websocket.send_text(json.dumps({"status": "ok", "action": "reserved", "ticket": payload}))

            else:
                await websocket.send_text(json.dumps({"status": "error", "reason": "unknown_type"}))

    except WebSocketDisconnect:
        # client disconnected normally
        pass
    except Exception as e:
        print("WebSocket exception:", e)
    finally:
        # cleanup connection mapping
        async with connections_lock:
            conns = connections_by_schedule.get(schedule_id)
            if conns and websocket in conns:
                conns.remove(websocket)
                if not conns:
                    connections_by_schedule.pop(schedule_id, None)
        # additionally, release any temporary holds owned by this websocket's user for this schedule
        try:
            user_id = ws_user_map.pop(websocket, None)
            if user_id is not None:
                # remove keys and get list of removed seat ids
                removed = await redis_manager.xoa_ghe_cua_user(int(schedule_id), user_id)
                # publish availability for each removed seat
                redis = await get_redis()
                channel = f"schedule:{schedule_id}:events"
                for gid in removed:
                    try:
                        payload = {"type": "available", "seatId": gid, "scheduleId": schedule_id}
                        await redis.publish(channel, json.dumps(payload))
                    except Exception:
                        continue
        except Exception:
            pass
