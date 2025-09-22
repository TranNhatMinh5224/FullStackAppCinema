SELECT *from phim
SELECT *from thanh_toan
drop
DELETE FROM phim;

CREATE INDEX idx_phim_ten_phim ON phim USING GIN (ten_phim gin_trgm_ops);
CREATE INDEX idx_phim_the_loai ON phim USING GIN (the_loai gin_trgm_ops);
CREATE INDEX idx_phim_ten_phim_trgm ON phim USING GIN (ten_phim gin_trgm_ops);
CREATE INDEX idx_phim_the_loai_trgm ON phim USING GIN (the_loai gin_trgm_ops);



ALTER SEQUENCE phim_id_seq RESTART WITH 1;

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Thêm người dùng
INSERT INTO taikhoan (id, email, mat_khau, sdt, gioi_tinh, ngay_sinh, dia_chi, ten)
VALUES
    (1, 'user1@example.com', 'password1', '0123456789', TRUE, '2000-01-01', 'Hà Nội', 'Nguyễn Văn A'),
    (2, 'user2@example.com', 'password2', '0987654321', FALSE, '1998-05-15', 'Hồ Chí Minh', 'Trần Thị B'),
    (3, 'user3@example.com', 'password3', '0912345678', TRUE, '1995-07-20', 'Đà Nẵng', 'Lê Văn C'),
    (4, 'user4@example.com', 'password4', '0908765432', FALSE, '1992-12-10', 'Hải Phòng', 'Phạm Thị D'),
    (5, 'user5@example.com', 'password5', '0981122334', TRUE, '1990-03-05', 'Cần Thơ', 'Trần Văn E');

-- Thêm phim
INSERT INTO phim (id, ten_phim, mo_ta, ngay_khoi_chieu, ngay_ket_thuc, the_loai, dao_dien, thoi_luong, dien_vien, hinh_anh, trailer)
VALUES
    (1, 'Avengers: Endgame', 'Siêu anh hùng cứu thế giới', '2025-03-01', '2025-04-30', 'Hành động', 'Russo Brothers', 180, 'Robert Downey Jr., Chris Evans', NULL, NULL),
    (2, 'John Wick 4', 'Sát thủ John Wick trở lại', '2025-04-10', '2025-05-20', 'Hành động', 'Chad Stahelski', 160, 'Keanu Reeves', NULL, NULL),
    (3, 'The Batman', 'Batman đối đầu với Riddler', '2025-05-01', '2025-06-30', 'Hành động', 'Matt Reeves', 175, 'Robert Pattinson', NULL, NULL),
    (4, 'Interstellar', 'Hành trình xuyên không gian', '2025-06-15', '2025-07-30', 'Khoa học viễn tưởng', 'Christopher Nolan', 169, 'Matthew McConaughey', NULL, NULL),
    (5, 'Titanic', 'Câu chuyện tình trên tàu Titanic', '2025-07-01', '2025-08-15', 'Tình cảm', 'James Cameron', 195, 'Leonardo DiCaprio, Kate Winslet', NULL, NULL);

-- Thêm lịch chiếu
INSERT INTO lich_chieu (id, phim_id, ngay_chieu)
VALUES
    (1, 1, '2025-03-27'),
    (2, 2, '2025-04-15'),
    (3, 3, '2025-05-10'),
    (4, 4, '2025-06-20'),
    (5, 5, '2025-07-05');

-- Thêm phòng chiếu
INSERT INTO phong_chieu (id, ten_phong, so_ghe)
VALUES
    (1, 'Phòng 1', 50),
    (2, 'Phòng 2', 60),
    (3, 'Phòng 3', 70),
    (4, 'Phòng 4', 80),
    (5, 'Phòng 5', 90);

-- Thêm suất chiếu
INSERT INTO suat_chieu (id, lich_chieu_id, phong_id, gio_bat_dau, gio_ket_thuc)
VALUES
    (1, 1, 1, '18:00:00', '20:30:00'),
    (2, 2, 2, '20:00:00', '22:30:00'),
    (3, 3, 3, '15:30:00', '18:00:00'),
    (4, 4, 4, '12:00:00', '14:30:00'),
    (5, 5, 5, '22:00:00', '00:30:00');

-- Thêm ghế trong phòng
INSERT INTO ghe (id, phong_id, so_ghe, loai_ghe, gia)
VALUES
    (1, 1, 'A1', 'Thường', 100000),
    (2, 1, 'A2', 'Thường', 100000),
    (3, 1, 'A3', 'VIP', 150000),
    (4, 1, 'A4', 'VIP', 150000),
    (5, 1, 'A5', 'Thường', 100000);

-- Thêm vé cho người dùng (giả lập đặt vé)
INSERT INTO ve (id, user_id, suat_chieu_id, ghe_id, trang_thai, gia_ve, created_at)
VALUES
    (1, 1, 1, 1, 'da_thanh_toan', 100000, NOW()),
    (2, 2, 2, 2, 'da_thanh_toan', 100000, NOW()),
    (3, 3, 3, 3, 'dang_xu_ly', 150000, NOW()),
    (4, 4, 4, 4, 'dang_xu_ly', 150000, NOW()),
    (5, 5, 5, 5, 'da_thanh_toan', 100000, NOW());

-- Thêm thanh toán
INSERT INTO thanh_toan (id, ve_id, phuong_thuc, trang_thai, ngay_thanh_toan, so_tien, ma_giao_dich)
VALUES
    (1, 1, 'Momo', 'thanh_cong', '2025-03-27', 100000, 'MOMO12345'),
    (2, 2, 'Momo', 'thanh_cong', '2025-04-15', 100000, 'Momo56789'),
    (3, 3, 'VNPay', 'dang_xu_ly', NULL, 150000, NULL),
    (4, 4, 'Momo', 'dang_xu_ly', NULL, 150000, NULL),
    (5, 5, 'Momo', 'thanh_cong', '2025-07-05', 100000, 'CASH98765');

-- Thêm bình luận phim
INSERT INTO binh_luan (id, user_id, phim_id, noi_dung, ngay_binh_luan, danh_gia)
VALUES
    (1, 1, 1, 'Phim quá hay, đáng xem!', NOW(), 5),
    (2, 2, 2, 'John Wick luôn đỉnh!', NOW(), 4),
    (3, 3, 3, 'Batman phiên bản này quá chất!', NOW(), 5),
    (4, 4, 4, 'Phim khoa học viễn tưởng tuyệt vời!', NOW(), 5),
    (5, 5, 5, 'Xem Titanic mà rơi nước mắt!', NOW(), 5);





TRUNCATE TABLE 
    taikhoan, phim, lich_chieu, phong_chieu, suat_chieu, ghe, ve, thanh_toan, binh_luan
RESTART IDENTITY CASCADE;

SELECT conname, condeferrable, convalidated, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'thanh_toan'::regclass;
-- "CHECK (((trang_thai)::text = ANY ((ARRAY['dang_xu_ly'::character varying, 'thanh_cong'::character varying, 'that_bai'::character varying, 'hoan_tien'::character varying])::text[])))"

