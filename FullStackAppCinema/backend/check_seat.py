#!/usr/bin/env python3

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database.Database import get_db
from app.models.models import Ghe
from sqlalchemy import select

async def check_seat():
    try:
        async for db in get_db():
            print('Checking seat status...')
            
            # Kiểm tra ghế 167
            seat_result = await db.execute(select(Ghe).where(Ghe.id == 167))
            seat = seat_result.scalar_one_or_none()
            
            if seat:
                print(f'Ghế 167 - Trạng thái: {seat.trang_thai}')
                print(f'Ghế 167 - Tên: {seat.ten_ghe}')
                print(f'Ghế 167 - Phòng: {seat.phong_chieu_id}')
            else:
                print('Không tìm thấy ghế 167')
            
            break
            
    except Exception as e:
        print(f'Error: {e}')
        print(f'Error type: {type(e)}')
        import traceback
        print(f'Traceback: {traceback.format_exc()}')

if __name__ == "__main__":
    import asyncio
    asyncio.run(check_seat())





