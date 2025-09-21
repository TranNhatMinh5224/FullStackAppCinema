import asyncio
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database.Database import get_db
from app.models.models import Ve
from sqlalchemy import select

async def check_ve():
    async for db in get_db():
        try:
            result = await db.execute(select(Ve).where(Ve.user_id == 30))
            ves = result.scalars().all()
            print(f'Found {len(ves)} tickets:')
            for ve in ves:
                print(f'  - ID: {ve.id}, Status: {ve.trang_thai}, User: {ve.user_id}, Suat: {ve.suat_chieu_id}, Ghe: {ve.ghe_id}')
        except Exception as e:
            print(f'Error: {e}')
        break

if __name__ == "__main__":
    asyncio.run(check_ve())





