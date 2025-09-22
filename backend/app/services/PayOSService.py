import logging
from datetime import datetime
from payos import PayOS
from app.config import PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY

logger = logging.getLogger(__name__)

class PayOSService:
    def __init__(self):
        self.client_id = PAYOS_CLIENT_ID
        self.api_key = PAYOS_API_KEY
        self.checksum_key = PAYOS_CHECKSUM_KEY
        
        # Khởi tạo PayOS SDK
        self.payos = PayOS(self.client_id, self.api_key, self.checksum_key)
        logger.info("PayOS SDK initialized successfully")

    def create_payment_link(self, product_name, price, description, return_url, cancel_url, booking_data=None):
        """
        Tạo payment link PayOS (vé đã được tạo trong endpoint)
        """
        try:
            logger.info(f"Creating payment link: product_name={product_name}, price={price}, description={description}")
            logger.info(f"Booking data: {booking_data}")
            
            # Lấy order_code từ booking_data (đã được tạo trong endpoint)
            order_code = booking_data.get('orderCode') if booking_data else int(datetime.now().timestamp())
            logger.info(f"Using order_code: {order_code}")
            
            # Thêm booking data vào return_url nếu có
            if booking_data:
                from urllib.parse import urlencode
                params = {
                    'user_id': booking_data.get('userId'),
                    'suat_chieu_id': booking_data.get('showtimeId'),
                    'ghe_ids': ','.join(map(str, booking_data.get('seatIds', []))),
                    'order_code': order_code
                }
                return_url_with_data = f"{return_url}?{urlencode(params)}"
                logger.info(f"Return URL with booking data: {return_url_with_data}")
            else:
                return_url_with_data = return_url
                logger.warning("No booking data provided, using default return URL")
            
            # Tạo body request
            body = {
                "orderCode": order_code,
                "amount": int(price),
                "description": description,
                "items": [
                    {
                        "name": product_name,
                        "quantity": 1,
                        "price": int(price)
                    }
                ],
                "returnUrl": return_url_with_data,
                "cancelUrl": cancel_url
            }
            
            logger.info(f"PayOS request body: {body}")
            
            # Gọi PayOS API
            payment_link_res = self.payos.payment_requests.create(body)
            logger.info(f"PayOS response: {payment_link_res}")
            
            # Convert object thành dict nếu cần
            data = payment_link_res
            if hasattr(payment_link_res, '__dict__'):
                data = payment_link_res.__dict__
            elif hasattr(payment_link_res, 'model_dump'):
                data = payment_link_res.model_dump()
            
            return {
                "error": 0,
                "message": "Success",
                "data": data
            }
            
        except Exception as e:
            logger.error(f"Error creating payment link: {e}")
            logger.error(f"Error type: {type(e)}")
            logger.error(f"Error details: {e.args}")
            return {
                "error": 1,
                "message": str(e),
                "data": None
            }

    def get_payment_link_information(self, order_code):
        """
        Lấy thông tin payment link từ PayOS
        """
        try:
            logger.info(f"Getting payment information for order {order_code}")
            
            # Gọi PayOS API để lấy thông tin payment
            payment_info = self.payos.payment_requests.get_payment_link_information(order_code)
            logger.info(f"PayOS payment info response: {payment_info}")
            
            # Convert object thành dict nếu cần
            data = payment_info
            if hasattr(payment_info, '__dict__'):
                data = payment_info.__dict__
            elif hasattr(payment_info, 'model_dump'):
                data = payment_info.model_dump()
            
            return {
                "error": 0,
                "message": "Success",
                "data": data
            }
            
        except Exception as e:
            logger.error(f"Error getting payment information: {e}")
            return {
                "error": 1,
                "message": str(e),
                "data": None
            }

# Tạo instance global
payos_service = PayOSService()
