#!/usr/bin/env python3

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database.Database import get_db
from app.models.models import Ve, ThanhToan

async def test_ve_creation():
    try:
        db = next(await get_db().__anext__())
        print('Testing Ve creation...')
        
        # Test tạo Ve object
        new_ve = Ve(
            user_id=30,
            suat_chieu_id=42,
            ghe_id=167,
            thanh_toan_id=1,
            trang_thai='Test',
            gia_ve=50000
        )
        print('Ve object created successfully')
        
        # Test tạo ThanhToan object
        new_thanh_toan = ThanhToan(
            phuong_thuc="PayOS",
            trang_thai="Test",
            ngay_thanh_toan="2025-01-20",
            so_tien=50000,
            ma_giao_dich="TEST123"
        )
        print('ThanhToan object created successfully')
        
        print('All tests passed!')
        
    except Exception as e:
        print(f'Error: {e}')
        print(f'Error type: {type(e)}')
        import traceback
        print(f'Traceback: {traceback.format_exc()}')

def test_ve_creation_sync():
    try:
        print('Testing Ve object creation (without DB)...')
        
        # Test tạo Ve object
        new_ve = Ve(
            user_id=30,
            suat_chieu_id=42,
            ghe_id=167,
            thanh_toan_id=1,
            trang_thai='Test',
            gia_ve=50000
        )
        print('Ve object created successfully')
        
        # Test tạo ThanhToan object
        new_thanh_toan = ThanhToan(
            phuong_thuc="PayOS",
            trang_thai="Test",
            ngay_thanh_toan="2025-01-20",
            so_tien=50000,
            ma_giao_dich="TEST123"
        )
        print('ThanhToan object created successfully')
        
        print('All tests passed!')
        
    except Exception as e:
        print(f'Error: {e}')
        print(f'Error type: {type(e)}')
        import traceback
        print(f'Traceback: {traceback.format_exc()}')

if __name__ == "__main__":
    test_ve_creation_sync()
