-- Tạo bảng tài khoản
CREATE TABLE taikhoan (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    mat_khau TEXT NOT NULL,
    sdt VARCHAR(15) NOT NULL,
    gioi_tinh BOOLEAN,
    ngay_sinh DATE,
    dia_chi TEXT,
    ten VARCHAR(255) NOT NULL
);

-- Tạo bảng phim
CREATE TABLE phim (
    id SERIAL PRIMARY KEY,
    ten_phim VARCHAR(255) NOT NULL,
    mo_ta TEXT,
    ngay_khoi_chieu DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    the_loai VARCHAR(255),
    dao_dien VARCHAR(255),
    thoi_luong INT NOT NULL,
    dien_vien TEXT,
    hinh_anh TEXT,
    trailer TEXT
);

-- Tạo bảng lịch chiếu
CREATE TABLE lich_chieu (
    id SERIAL PRIMARY KEY,
    phim_id INT NOT NULL,
    ngay_chieu DATE NOT NULL,
    FOREIGN KEY (phim_id) REFERENCES phim(id) ON DELETE CASCADE
);

-- Tạo bảng phòng chiếu
CREATE TABLE phong_chieu (
    id SERIAL PRIMARY KEY,
    ten_phong VARCHAR(50) NOT NULL,
    so_ghe INT NOT NULL
);

-- Tạo bảng suất chiếu
CREATE TABLE suat_chieu (
    id SERIAL PRIMARY KEY,
    lich_chieu_id INT NOT NULL,
    phong_id INT NOT NULL,
    gio_bat_dau TIME NOT NULL,
    gio_ket_thuc TIME NOT NULL,
    FOREIGN KEY (lich_chieu_id) REFERENCES lich_chieu(id) ON DELETE CASCADE,
    FOREIGN KEY (phong_id) REFERENCES phong_chieu(id) ON DELETE CASCADE
);

-- Tạo bảng ghế
CREATE TABLE ghe (
    id SERIAL PRIMARY KEY,
    phong_id INT NOT NULL,
    so_ghe VARCHAR(10) NOT NULL,
    loai_ghe VARCHAR(50) NOT NULL DEFAULT 'Thường',
    gia INT NOT NULL DEFAULT 0,
    
    FOREIGN KEY (phong_id) REFERENCES phong_chieu(id) ON DELETE CASCADE
);

-- Tạo bảng vé
CREATE TABLE ve (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    suat_chieu_id INT NOT NULL,
    ghe_id INT NOT NULL,
    trang_thai VARCHAR(50) NOT NULL,
    gia_ve DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES taikhoan(id) ON DELETE CASCADE,
    FOREIGN KEY (suat_chieu_id) REFERENCES suat_chieu(id) ON DELETE CASCADE,
    FOREIGN KEY (ghe_id) REFERENCES ghe(id) ON DELETE CASCADE
);

-- Tạo bảng thanh toán
CREATE TABLE thanh_toan (
    id SERIAL PRIMARY KEY,
    ve_id INT UNIQUE NOT NULL,
    phuong_thuc VARCHAR(50) NOT NULL,
    trang_thai VARCHAR(50) NOT NULL,
    ngay_thanh_toan DATE DEFAULT NULL,
    so_tien DECIMAL(10,2) NOT NULL,
    ma_giao_dich VARCHAR(255),
    FOREIGN KEY (ve_id) REFERENCES ve(id) ON DELETE CASCADE
);

-- Tạo bảng bình luận
CREATE TABLE binh_luan (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    phim_id INT NOT NULL,
    noi_dung TEXT NOT NULL,
    ngay_binh_luan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    danh_gia INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES taikhoan(id) ON DELETE CASCADE,
    FOREIGN KEY (phim_id) REFERENCES phim(id) ON DELETE CASCADE
);
