-- Script để thêm bảng payment_history vào database
-- Chạy script này trong PostgreSQL để tạo bảng mới

CREATE TABLE IF NOT EXISTS payment_history (
    id SERIAL PRIMARY KEY,
    ve_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'VND',
    payment_method VARCHAR(50) NOT NULL,
    payment_intent_id VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ve_id) REFERENCES ve(id) ON DELETE CASCADE
);

-- Tạo index để tối ưu hóa truy vấn
CREATE INDEX IF NOT EXISTS idx_payment_history_ve_id ON payment_history(ve_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_payment_intent_id ON payment_history(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON payment_history(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON payment_history(created_at);

