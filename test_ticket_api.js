// Test script để kiểm tra ticket API
const API_BASE_URL = 'http://192.168.1.11:8000';

const testTicketAPI = async (userId) => {
    try {
        console.log(`Testing ticket API for user ${userId}...`);
        const response = await fetch(`${API_BASE_URL}/api/v1/Ve-Detail-user/${userId}`);
        const result = await response.json();
        
        console.log(`User ${userId} - Status: ${response.status}`);
        console.log(`User ${userId} - Response:`, result);
        
        if (result.success && Array.isArray(result.data)) {
            console.log(`User ${userId} - Ticket count: ${result.data.length}`);
        } else {
            console.log(`User ${userId} - No tickets or error`);
        }
        
        return result;
    } catch (error) {
        console.error(`User ${userId} - Error:`, error);
        return null;
    }
};

// Test với các user khác nhau
const testAllUsers = async () => {
    console.log('=== Testing Ticket API for All Users ===');
    
    for (let userId = 30; userId <= 32; userId++) {
        await testTicketAPI(userId);
        console.log('---');
    }
};

// Chạy test
testAllUsers();
