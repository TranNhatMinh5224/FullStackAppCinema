import axios from 'axios';

const SERVER_URL = 'http://192.168.1.11:8000';

export async function createPaymentLink(formValue) {
  try {
    console.log('Creating payment link:', formValue);
    
    let res = await axios({
      method: "POST",
      url: `${SERVER_URL}/api/v1/payos/order/create`,
      data: formValue,
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    console.log('Payment link response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error creating payment link:', error);
    return error.response?.data || {
      error: 1,
      message: "Không thể kết nối đến server",
      data: null
    };
  }
}

export async function getOrder(orderCode) {
  try {
    console.log('Getting order:', orderCode);
    
    let res = await axios({
      method: "GET",
      url: `${SERVER_URL}/api/v1/payos/order/${orderCode}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    console.log('Order response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error getting order:', error);
    return error.response?.data || {
      error: 1,
      message: "Không thể kết nối đến server",
      data: null
    };
  }
}

export async function confirmPayOSPayment(orderCode) {
  try {
    console.log('Confirming PayOS payment:', orderCode);
    
    let res = await axios({
      method: "POST",
      url: `${SERVER_URL}/api/v1/payos/confirm/${orderCode}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    console.log('PayOS confirm response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error confirming PayOS payment:', error);
    return error.response?.data || {
      error: 1,
      message: "Không thể xác nhận thanh toán",
      data: null
    };
  }
}

