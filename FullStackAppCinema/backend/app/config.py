import os
from dotenv import load_dotenv

# Load biến môi trường từ file .env
load_dotenv()

# Cấu hình bảo mật & JWT
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

# Cấu hình Database
DATABASE_URL = os.getenv("DATABASE_URL")

# Cấu hình PayOS
PAYOS_CLIENT_ID = os.getenv("PAYOS_CLIENT_ID", "ff59ecf8-9a18-463f-aeae-12f366f76f7d")
PAYOS_API_KEY = os.getenv("PAYOS_API_KEY", "1d5bf1d2-b31a-4157-bfb6-d3e739a05735")
PAYOS_CHECKSUM_KEY = os.getenv("PAYOS_CHECKSUM_KEY", "555569183626b018f5df0de1b222b8e1c65c9cd7898849a86392e3106d2cf0c4")
PAYOS_API_URL = os.getenv("PAYOS_API_URL", "https://api-merchant.payos.vn")
PAYOS_RETURN_URL = os.getenv("PAYOS_RETURN_URL", "http://192.168.1.11:8000/api/v1/payos/return")

