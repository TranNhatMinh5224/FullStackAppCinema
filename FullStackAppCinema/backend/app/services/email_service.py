import random
import string
import os
import smtplib
import asyncio
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

async def generate_otp(length: int = 6) -> str:
    return ''.join(random.choices(string.digits, k=length))

async def send_otp_email(email: str, otp: str):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    
    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = email
    msg['Subject'] = "Mã OTP quên mật khẩu - Cinema App"
    
    body = f"""
    Chào bạn,

    Mã OTP để đặt lại mật khẩu của bạn là: {otp}

    Mã này sẽ hết hạn sau 5 phút. Vui lòng không chia sẻ mã này với ai.

    Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.

    Trân trọng,
    Cinema App Team
    """
    msg.attach(MIMEText(body, 'plain'))
    
    # Chạy SMTP trong thread pool để không block event loop
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, _send_email_sync, smtp_host, smtp_port, smtp_user, smtp_pass, msg, email)

def _send_email_sync(smtp_host, smtp_port, smtp_user, smtp_pass, msg, email):
    server = smtplib.SMTP(smtp_host, smtp_port)
    server.starttls()
    server.login(smtp_user, smtp_pass)
    text = msg.as_string()
    server.sendmail(smtp_user, email, text)
    server.quit()

async def send_and_store_otp(email: str):
    from app.redis.redis import redis_manager  # Import ở đây để tránh circular import
    otp = await generate_otp()
    await redis_manager.set_otp(email, otp)
    await send_otp_email(email, otp)
    return otp
