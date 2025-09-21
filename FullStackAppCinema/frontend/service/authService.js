import axios from "axios";
import { API_BASE_URL } from './APIpath';

const API_URL = `${API_BASE_URL}/account`;

export const changePassword = async (userId, formData) => {
    try {
        const apiUrl = `${API_URL}/change-password/${userId}`;
        const response = await axios.put(apiUrl, formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.log("Lỗi khi đổi mật khẩu:", error.response?.data || error.message);
        throw error;
    }
};

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email: email,
            mat_khau: password
        });

        return response.data;
    } catch (error) {
        console.log("Lỗi đăng nhập:", error.response?.data || error.message);
        throw error;
    }
};

export const signup = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/register`, data);
        return response.data;
    } catch (error) {
        // console.error("Lỗi đăng nhập:", error.response?.data || error.message);
        // throw error;
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/forgotpassword`, { email });
        return response.data;
    } catch (error) {
        console.log("Lỗi quên mật khẩu:", error.response?.data || error.message);
        throw error;
    }
};

export const updateUserInfo = async (userId, userData) => {
    try {
        const response = await axios.put(
            `${API_URL}/users/${userId}`,
            userData
        );
        return response.data;
    } catch (error) {
        console.log("Lỗi cập nhật thông tin:", error.response?.data || error.message);
        throw error;
    }
};