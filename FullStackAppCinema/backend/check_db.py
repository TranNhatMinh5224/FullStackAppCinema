#!/usr/bin/env python3

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database.Database import get_db
from app.models.models import Ve, ThanhToan
from sqlalchemy.orm import Session

async def check_database():
    try:
        async for db in get_db():
            print('Checking database...')
            
            # Kiểm tra có thanh_toan nào không
            from sqlalchemy import select, func
            thanh_toan_count_result = await db.execute(select(func.count(ThanhToan.id)))
            thanh_toan_count = thanh_toan_count_result.scalar()
            print(f'Total ThanhToan records: {thanh_toan_count}')
            
            if thanh_toan_count > 0:
                latest_thanh_toan_result = await db.execute(select(ThanhToan).order_by(ThanhToan.id.desc()).limit(1))
                latest_thanh_toan = latest_thanh_toan_result.scalar_one_or_none()
                if latest_thanh_toan:
                    print(f'Latest ThanhToan ID: {latest_thanh_toan.id}')
                    print(f'Latest ThanhToan ma_giao_dich: {latest_thanh_toan.ma_giao_dich}')
            else:
                print('No ThanhToan records found')
            
            # Kiểm tra có ve nào không
            ve_count_result = await db.execute(select(func.count(Ve.id)))
            ve_count = ve_count_result.scalar()
            print(f'Total Ve records: {ve_count}')
            
            if ve_count > 0:
                latest_ve_result = await db.execute(select(Ve).order_by(Ve.id.desc()).limit(1))
                latest_ve = latest_ve_result.scalar_one_or_none()
                if latest_ve:
                    print(f'Latest Ve ID: {latest_ve.id}')
                    print(f'Latest Ve thanh_toan_id: {latest_ve.thanh_toan_id}')
            
            break
            
    except Exception as e:
        print(f'Error: {e}')
        print(f'Error type: {type(e)}')
        import traceback
        print(f'Traceback: {traceback.format_exc()}')

if __name__ == "__main__":
    import asyncio
    asyncio.run(check_database())
