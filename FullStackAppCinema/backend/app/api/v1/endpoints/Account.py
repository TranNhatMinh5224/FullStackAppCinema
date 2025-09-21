from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.Account import register_user, login_user, info_user, update_user, forgot_password, change_password
from app.database.Database import get_db
from app.schemas.schemas import (
    TaiKhoanCreate, TaiKhoanLogin, TaiKhoanUpdate, TaiKhoanResponse,
    ForgotPassword, ChangePassword, RegisterResponse, LoginResponse,
    ForgotPasswordResponse, ChangePasswordResponse
)

router = APIRouter(prefix="/account", tags=["Account"])

# Endpoint đăng ký
@router.post("/register", response_model=RegisterResponse)
async def register(user_data: TaiKhoanCreate, db: AsyncSession = Depends(get_db)):
    return await register_user(user_data, db)

# Endpoint đăng nhập
@router.post("/login", response_model=LoginResponse)
async def login(user_data: TaiKhoanLogin, db: AsyncSession = Depends(get_db)):
    return await login_user(user_data, db)

# Endpoint xem thông tin người dùng
@router.get("/profile/{user_id}", response_model=TaiKhoanResponse)
async def profile_user(user_id: int, db: AsyncSession = Depends(get_db)):
    return await info_user(user_id, db)

# Endpoint cập nhật thông tin người dùng
@router.put("/users/{user_id}", response_model=TaiKhoanResponse)
async def update_user_endpoint(user_id: int, update_data: TaiKhoanUpdate, db: AsyncSession = Depends(get_db)):
    return await update_user(user_id, update_data, db)

# Endpoint quên mật khẩu
@router.post("/forgotpassword", response_model=ForgotPasswordResponse)
async def forgot_password_endpoint(request_data: ForgotPassword, db: AsyncSession = Depends(get_db)):
    return await forgot_password(request_data.email, db)

# Endpoint đổi mật khẩu
@router.put("/change-password/{user_id}", response_model=ChangePasswordResponse)
async def changepassword(user_id: int, change_mk: ChangePassword, db: AsyncSession = Depends(get_db)):
    return await change_password(user_id, change_mk, db)