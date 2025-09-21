// Test script để kiểm tra kết nối đến backend
import axios from 'axios';

const testConnection = async () => {
  try {
    console.log('Testing connection to backend...');
    
    // Test 1: Kiểm tra docs endpoint
    const docsResponse = await axios.get('http://192.168.1.11:8000/docs');
    console.log('✅ Docs endpoint accessible:', docsResponse.status);
    
    // Test 2: Kiểm tra VNPay endpoint
    const vnpayResponse = await axios.post('http://192.168.1.11:8000/api/v1/vnpay/create-payment', {
      amount: 100000,
      order_info: 'Test connection',
      ve_id: 1
    });
    console.log('✅ VNPay endpoint accessible:', vnpayResponse.status);
    console.log('Response data:', vnpayResponse.data);
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
  }
};

export default testConnection;
