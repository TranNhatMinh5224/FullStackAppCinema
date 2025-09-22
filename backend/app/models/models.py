from sqlalchemy import Column, Integer, String, Boolean, Date, Time, ForeignKey, Text, DECIMAL ,DateTime , func , Enum
from sqlalchemy.orm import relationship
from app.database.Database import Base
from datetime import datetime
import enum

class TaiKhoan(Base):
    __tablename__ = "taikhoan"

    id = Column(Integer, primary_key=True, index=True ,  autoincrement=True)
    email = Column(String(255), unique=True, nullable=False)
    mat_khau = Column(Text, nullable=False)
    sdt = Column(String(15), nullable=False)
    gioi_tinh = Column(Boolean, nullable=True)
    ngay_sinh = Column(Date, nullable=True)
    dia_chi = Column(String, nullable=True)
    ten = Column(String(255), nullable=False)
 
    ve = relationship("Ve", back_populates="user")
    binh_luan = relationship("BinhLuan", back_populates="user")




class Phim(Base):
    __tablename__ = "phim"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ten_phim = Column(String(255), nullable=False)
    mo_ta = Column(Text, nullable=True)
    ngay_khoi_chieu = Column(Date, nullable=False)
    ngay_ket_thuc = Column(Date, nullable=False)
    the_loai = Column(String(255), nullable=True)
    dao_dien = Column(String(255), nullable=True)
    thoi_luong = Column(Integer, nullable=False)
    dien_vien = Column(Text, nullable=True)
    hinh_anh = Column(Text, nullable=True)
    trailer = Column(Text, nullable=True)

    lich_chieu = relationship("LichChieu", back_populates="phim")
    binh_luan = relationship("BinhLuan", back_populates="phim")




class LichChieu(Base):
    __tablename__ = "lich_chieu"

    id = Column(Integer, primary_key=True, index=True,autoincrement=True)
    phim_id = Column(Integer, ForeignKey("phim.id", ondelete="CASCADE"), nullable=False)
    ngay_chieu = Column(Date, nullable=False)

    phim = relationship("Phim", back_populates="lich_chieu")
    suat_chieu = relationship("SuatChieu", back_populates="lich_chieu")




class SuatChieu(Base):
    __tablename__ = "suat_chieu"

    id = Column(Integer, primary_key=True, index=True , autoincrement=True)
    lich_chieu_id = Column(Integer, ForeignKey("lich_chieu.id", ondelete="CASCADE"), nullable=False)
    phong_id = Column(Integer, ForeignKey("phong_chieu.id", ondelete="CASCADE"), nullable=False)
    gio_bat_dau = Column(Time, nullable=False)
    gio_ket_thuc = Column(Time, nullable=False)

    lich_chieu = relationship("LichChieu", back_populates="suat_chieu")
    phong = relationship("PhongChieu", back_populates="suat_chieu")
    ve = relationship("Ve", back_populates="suat_chieu")



class PhongChieu(Base):
    __tablename__ = "phong_chieu"

    id = Column(Integer, primary_key=True, index=True , autoincrement=True)
    ten_phong = Column(String(50), nullable=False)
    so_ghe = Column(Integer, nullable=False)

    suat_chieu = relationship("SuatChieu", back_populates="phong")
    ghe = relationship("Ghe", back_populates="phong")





class Ghe(Base):
    __tablename__ = "ghe"

    id = Column(Integer, primary_key=True, index=True , autoincrement=True)
    phong_id = Column(Integer, ForeignKey("phong_chieu.id", ondelete="CASCADE"), nullable=False)
    so_ghe = Column(String(10), nullable=False)
    loai_ghe = Column(String(50), nullable=False, default='Thường')
    gia = Column(Integer, nullable=False, default=0)
   

    phong = relationship("PhongChieu", back_populates="ghe")
    ve = relationship("Ve", back_populates="ghe")

class ThanhToan(Base):
    __tablename__ = "thanh_toan"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    phuong_thuc = Column(String(50), nullable=False)
    trang_thai = Column(String(50), nullable=False)
    ngay_thanh_toan = Column(Date, nullable=True)
    so_tien = Column(DECIMAL(10, 2), nullable=False)
    ma_giao_dich = Column(String(255), nullable=True)

    ve = relationship("Ve", back_populates="thanh_toan")  # Quan hệ 1:N

class Ve(Base):
    __tablename__ = "ve"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("taikhoan.id", ondelete="CASCADE"), nullable=False)
    suat_chieu_id = Column(Integer, ForeignKey("suat_chieu.id", ondelete="CASCADE"), nullable=False)
    ghe_id = Column(Integer, ForeignKey("ghe.id", ondelete="CASCADE"), nullable=False)
    thanh_toan_id = Column(Integer, ForeignKey("thanh_toan.id", ondelete="SET NULL"), nullable=False)  # Bắt buộc
    trang_thai = Column(String(50), nullable=False)
    gia_ve = Column(DECIMAL(10, 2), nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.now)

    user = relationship("TaiKhoan", back_populates="ve")
    suat_chieu = relationship("SuatChieu", back_populates="ve")
    ghe = relationship("Ghe", back_populates="ve")
    thanh_toan = relationship("ThanhToan", back_populates="ve")


class BinhLuan(Base):
    __tablename__ = "binh_luan"

    id = Column(Integer, primary_key=True, index=True , autoincrement=True)
    user_id = Column(Integer, ForeignKey("taikhoan.id", ondelete="CASCADE"), nullable=False)
    phim_id = Column(Integer, ForeignKey("phim.id", ondelete="CASCADE"), nullable=False)
    noi_dung = Column(Text, nullable=False)
    ngay_binh_luan = Column(DateTime, default=func.now())
    danh_gia = Column(Integer, nullable=False)
    user = relationship("TaiKhoan", back_populates="binh_luan")
    phim = relationship("Phim", back_populates="binh_luan")

class PaymentHistory(Base):
    __tablename__ = "payment_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ve_id = Column(Integer, ForeignKey("ve.id", ondelete="CASCADE"), nullable=False)
    amount = Column(DECIMAL(10, 2), nullable=False)
    currency = Column(String(10), nullable=False, default='VND')
    payment_method = Column(String(50), nullable=False)
    payment_intent_id = Column(String(255), nullable=True)
    status = Column(String(50), nullable=False)  # completed, failed, pending
    transaction_id = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    ve = relationship("Ve", backref="payment_histories")