#!/usr/bin/env python3

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

import asyncio
from app.database.Database import get_db
from app.models.models import Ve, ThanhToan
from datetime import datetime
import random

async def test_payos_return():
    try:
        async for db in get_db():
            print('Testing PayOS return logic...')
            
            # Tạo mã giao dịch
            ma_giao_dich = f"{datetime.now().strftime('%d%m%y%H%M%S')}{random.randint(10, 99)}"
            print(f'Generated ma_giao_dich: {ma_giao_dich}')
            
            # Tạo thanh_toan trước
            new_thanh_toan = ThanhToan(
                phuong_thuc="PayOS",
                trang_thai="Đã thanh toán",
                ngay_thanh_toan=datetime.now().date(),
                so_tien=50000,
                ma_giao_dich=ma_giao_dich
            )
            db.add(new_thanh_toan)
            await db.flush()  # Để lấy ID
            
            print(f'Created ThanhToan with ID: {new_thanh_toan.id}')
            
            # Tạo vé mới
            new_ve = Ve(
                user_id=30,
                suat_chieu_id=42,
                ghe_id=167,
                thanh_toan_id=new_thanh_toan.id,
                trang_thai="Đã xác nhận",
                gia_ve=50000
            )
            
            db.add(new_ve)
            await db.commit()
            await db.refresh(new_ve)
            
            print(f'Created Ve with ID: {new_ve.id}')
            print('PayOS return logic test successful!')
            
            break
            
    except Exception as e:
        print(f'Error: {e}')
        print(f'Error type: {type(e)}')
        import traceback
        print(f'Traceback: {traceback.format_exc()}')

if __name__ == "__main__":
    asyncio.run(test_payos_return())






