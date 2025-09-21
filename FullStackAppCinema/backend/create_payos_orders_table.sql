-- Tạo bảng payos_orders để lưu thông tin đơn hàng PayOS
CREATE TABLE IF NOT EXISTS payos_orders (
    order_code BIGINT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    suat_chieu_id INTEGER NOT NULL,
    ghe_ids TEXT NOT NULL,  -- Lưu danh sách ghế dạng "1,2,3"
    tong_gia DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tạo index để tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_payos_orders_user_id ON payos_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payos_orders_created_at ON payos_orders(created_at);

