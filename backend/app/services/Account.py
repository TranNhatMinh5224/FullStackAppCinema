from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from sqlalchemy.future import select
from app.models.models import TaiKhoan
from app.schemas.schemas import (
    TaiKhoanCreate, TaiKhoanLogin, TaiKhoanResponse,
    TaiKhoanUpdate, ChangePassword, RegisterResponse, LoginResponse,
    ForgotPasswordResponse, ChangePasswordResponse, VerifyOTPResponse
)
from app.services.email_service import send_and_store_otp
from app.redis.redis import redis_manager

# Đăng ký người dùng
async def register_user(user: TaiKhoanCreate, db: AsyncSession):
    # Kiểm tra email đã tồn tại chưa
    query = select(TaiKhoan).where(TaiKhoan.email == user.email)
    result = await db.execute(query)
    db_user = result.scalars().first()
    
    if db_user:
        raise HTTPException(status_code=400, detail="Email đã được đăng ký")
    
    # Kiểm tra thông tin đầu vào
    if any(val is None or val == "" for val in [user.email, user.mat_khau, user.ten, user.sdt]):
        raise HTTPException(status_code=400, detail="Chưa điền đầy đủ thông tin")
    
    # Tạo người dùng mới
    new_user = TaiKhoan(
        email=user.email,
        mat_khau=user.mat_khau,
        sdt=user.sdt,
        gioi_tinh=user.gioi_tinh,
        ngay_sinh=user.ngay_sinh,
        dia_chi=user.dia_chi,
        ten=user.ten,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Trả về phản hồi
    return RegisterResponse(message="Đăng ký thành công!", user_id=new_user.id)

# Đăng nhập người dùng
async def login_user(user: TaiKhoanLogin, db: AsyncSession):
    # Tìm người dùng theo email
    query = select(TaiKhoan).where(TaiKhoan.email == user.email)
    result = await db.execute(query)
    db_user = result.scalars().first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Email chưa được đăng ký")
    
    if db_user.mat_khau != user.mat_khau:
        raise HTTPException(status_code=400, detail="Mật khẩu sai. Hãy thử lại")
    
    # Tạo đối tượng TaiKhoanResponse
    user_response = TaiKhoanResponse(
        id=str(db_user.id),
        email=db_user.email,
        phone=db_user.sdt,
        gender=db_user.gioi_tinh,
        dob=db_user.ngay_sinh,
        address=db_user.dia_chi,
        name=db_user.ten
    )
    
    # Trả về phản hồi
    return LoginResponse(message="Đăng nhập thành công!", user=user_response)

# Lấy thông tin người dùng
async def info_user(user_id: int, db: AsyncSession):
    # Tìm người dùng theo ID
    query = select(TaiKhoan).where(TaiKhoan.id == user_id)
    result = await db.execute(query)
    db_user = result.scalars().first()

    if not db_user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại")
    
    # Trả về thông tin người dùng
    return TaiKhoanResponse(
        id=str(db_user.id),
        email=db_user.email,
        phone=db_user.sdt,
        gender=db_user.gioi_tinh,
        dob=db_user.ngay_sinh,
        address=db_user.dia_chi,
        name=db_user.ten
    )

# Cập nhật thông tin người dùng
async def update_user(user_id: int, update_data: TaiKhoanUpdate, db: AsyncSession):
    # Tìm người dùng theo ID
    result = await db.execute(select(TaiKhoan).where(TaiKhoan.id == user_id))
    db_user = result.scalars().first()

    if not db_user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại")

    # Cập nhật thông tin
    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(db_user, key, value)

    await db.commit()
    await db.refresh(db_user)
    
    # Trả về thông tin người dùng đã cập nhật
    return TaiKhoanResponse(
        id=str(db_user.id),
        email=db_user.email,
        phone=db_user.sdt,
        gender=db_user.gioi_tinh,
        dob=db_user.ngay_sinh,
        address=db_user.dia_chi,
        name=db_user.ten
    )
# Quên mật khẩu
async def forgot_password(email: str, db: AsyncSession):
    # Tìm người dùng theo email
    result = await db.execute(select(TaiKhoan).where(TaiKhoan.email == email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=400, detail="Email không tồn tại trong hệ thống")
    
    # Reset counter attempts khi gửi OTP mới
    await redis_manager.reset_otp_attempts(email)
    
    # Gửi OTP và lưu vào Redis
    await send_and_store_otp(email)
    return ForgotPasswordResponse(message="OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.")

# Xác thực OTP
async def verify_otp(email: str, otp: str):
    # Kiểm tra số lần thử
    attempts = await redis_manager.get_otp_attempts(email)
    if attempts >= 5:
        raise HTTPException(status_code=429, detail="Quá nhiều lần thử OTP. Vui lòng yêu cầu OTP mới.")
    
    # Lấy OTP từ Redis
    stored_otp = await redis_manager.get_otp(email)
    if not stored_otp:
        raise HTTPException(status_code=400, detail="OTP đã hết hạn hoặc không tồn tại")
    
    # Kiểm tra OTP
    if stored_otp != otp:
        # Tăng counter khi sai
        await redis_manager.increment_otp_attempts(email)
        remaining_attempts = 5 - (attempts + 1)
        raise HTTPException(status_code=400, detail=f"OTP không đúng. Còn {remaining_attempts} lần thử.")
    
    # OTP đúng - reset counter và xóa OTP
    await redis_manager.reset_otp_attempts(email)
    await redis_manager.delete_otp(email)
    await redis_manager.set_otp_verified(email)  # Set flag cho phép reset password
    return {"message": "OTP hợp lệ. Bạn có thể đặt lại mật khẩu."}

# Đặt lại mật khẩu sau khi xác minh OTP
async def reset_password(email: str, new_password: str, db: AsyncSession):
    # Kiểm tra xem OTP đã được verify chưa
    if not await redis_manager.is_otp_verified(email):
        raise HTTPException(status_code=400, detail="Vui lòng xác thực OTP trước khi đặt lại mật khẩu")
    
    # Tìm người dùng theo email
    result = await db.execute(select(TaiKhoan).where(TaiKhoan.email == email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=400, detail="Email không tồn tại")
    
    # Cập nhật mật khẩu mới
    user.mat_khau = new_password
    await db.commit()
    
    # Xóa flag sau khi reset thành công
    await redis_manager.delete_otp_verified(email)
    
    return {"message": "Mật khẩu đã được đặt lại thành công"}

# Đổi mật khẩu
async def change_password(user_id: int, change: ChangePassword, db: AsyncSession):
    # Tìm người dùng theo ID
    result = await db.execute(select(TaiKhoan).where(TaiKhoan.id == user_id))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User không tồn tại")
    if change.oldpassword != user.mat_khau:
        raise HTTPException(status_code=400, detail="Mật Khẩu cũ không khớp")
    if change.oldpassword == change.newpassword:
        raise HTTPException(status_code=400, detail="Hãy thay đổi mật khẩu khác mạnh hơn")
    
    # Cập nhật mật khẩu mới
    user.mat_khau = change.newpassword
    await db.commit()
    
    # Trả về phản hồi
    return ChangePasswordResponse(message="Đổi mật khẩu thành công")

# Xác thực OTP - phiên bản mới (dùng để test)
async def verify_otp_new(email: str, otp: str):
    print(f"verify_otp_new called with email: {email}, otp: {otp}")
    return {"message": "OTP hợp lệ. Bạn có thể đặt lại mật khẩu."}