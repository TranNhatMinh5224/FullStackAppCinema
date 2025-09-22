// Test script để kiểm tra OTP system với attempt limits
const API_BASE_URL = 'http://localhost:8000';

const testForgotPassword = async (email) => {
    try {
        console.log(`Testing forgot password for ${email}...`);
        const response = await fetch(`${API_BASE_URL}/account/forgotpassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        const result = await response.json();

        console.log(`Forgot Password - Status: ${response.status}`);
        console.log(`Forgot Password - Response:`, result);
        return result;
    } catch (error) {
        console.error(`Forgot Password - Error:`, error);
        return null;
    }
};

const testVerifyOTP = async (email, otp) => {
    try {
        console.log(`Testing verify OTP for ${email} with OTP: ${otp}...`);
        const response = await fetch(`${API_BASE_URL}/account/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        });
        const result = await response.json();

        console.log(`Verify OTP - Status: ${response.status}`);
        console.log(`Verify OTP - Response:`, result);
        return result;
    } catch (error) {
        console.error(`Verify OTP - Error:`, error);
        return null;
    }
};

const testResetPassword = async (email, newPassword) => {
    try {
        console.log(`Testing reset password for ${email}...`);
        const response = await fetch(`${API_BASE_URL}/account/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, new_password: newPassword }),
        });
        const result = await response.json();

        console.log(`Reset Password - Status: ${response.status}`);
        console.log(`Reset Password - Response:`, result);
        return result;
    } catch (error) {
        console.error(`Reset Password - Error:`, error);
        return null;
    }
};

const testOTPAttemptLimits = async () => {
    console.log('=== Testing OTP System with Attempt Limits ===');

    const testEmail = 'test@gmail.com'; // Thay bằng email thật để test
    const wrongOTP = '000000';
    const correctOTP = '123456'; // Bạn cần check email thật để lấy OTP đúng

    // 1. Gửi OTP
    console.log('\n1. Sending OTP...');
    await testForgotPassword(testEmail);

    // 2. Thử verify với OTP sai nhiều lần
    console.log('\n2. Testing wrong OTP attempts...');
    for (let i = 1; i <= 6; i++) {
        console.log(`\nAttempt ${i}:`);
        await testVerifyOTP(testEmail, wrongOTP);
    }

    // 3. Thử verify với OTP đúng (sẽ fail vì quá 5 lần)
    console.log('\n3. Testing correct OTP after max attempts...');
    await testVerifyOTP(testEmail, correctOTP);

    // 4. Gửi OTP mới
    console.log('\n4. Sending new OTP...');
    await testForgotPassword(testEmail);

    // 5. Thử verify với OTP đúng
    console.log('\n5. Testing correct OTP...');
    await testVerifyOTP(testEmail, correctOTP);

    // 6. Thử reset password mà chưa verify OTP (sẽ fail)
    console.log('\n6. Testing reset password without OTP verification...');
    await testResetPassword(testEmail, 'newpassword123');

    // 7. Reset password sau khi verify OTP
    console.log('\n7. Testing reset password after OTP verification...');
    await testResetPassword(testEmail, 'newpassword123');
};

// Chạy test
testOTPAttemptLimits();
