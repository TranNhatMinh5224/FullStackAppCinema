# config.py
import os

# Ví dụ giá trị secret key được tạo ngẫu nhiên (32 ký tự hex, tương đương 16 bytes)
SECRET_KEY = os.getenv("SECRET_KEY", "d9b9b959a7f9e0d05cbb9e7180c0b6a1")

DATABASE_URL = "postgresql+asyncpg://postgres:05022004@localhost:5432/cinema_ticket"
