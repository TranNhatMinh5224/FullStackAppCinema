from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from sqlalchemy.future import select
from app.models.models import TaiKhoan
from app.schemas.schemas import (
    TaiKhoanCreate, TaiKhoanLogin, TaiKhoanResponse,
    TaiKhoanUpdate, ChangePassword, RegisterResponse, LoginResponse,
    ForgotPasswordResponse, ChangePasswordResponse
)

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
        raise HTTPException(status_code=400, detail="Không thấy tài khoản")
    
    # Giả lập gửi email reset mật khẩu
    return ForgotPasswordResponse(message="mật khẩu của bạn là : " , mat_khau= user.mat_khau)

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