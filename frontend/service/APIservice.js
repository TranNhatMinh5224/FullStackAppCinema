
import axios from 'axios';
import { API_BASE_URL } from './APIpath';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
});

// Hàm chung để log lỗi chi tiết
const handleError = (message, error) => {
    console.log(message, error.message);
    if (error.response) {
        console.log('Chi tiết lỗi:', error.response.data);
    }
};

export const getMovies = async () => {
    try {
        const response = await api.get('/films/showing');
        return response.data;
    } catch (error) {
        handleError('Lỗi khi lấy danh sách phim:', error);
        return null;
    }
};

// Lấy danh sách phim sắp chiếu
export const getMoviesUpcoming = async () => {
    try {
        const response = await api.get('/films/upcoming');
        return response.data;
    } catch (error) {
        handleError('Lỗi khi lấy phim sắp chiếu:', error);
        return null;
    }
};

export const getMovieDetails = async (movieId) => {
    try {
        const response = await api.get(`/phim/${movieId}`);
        return response.data;
    } catch (error) {
        handleError('Lỗi khi lấy thông tin phim:', error);
        return null;
    }
};

export const getSeat = async (showtimeId) => {
    try {
        const response = await api.get(`/listghe/ghe/${showtimeId}`);
        return response.data;
    } catch (error) {
        handleError('Lỗi khi lấy thông tin ghế:', error);
        return null;
    }
};

export const postSeat = async (data) => {
    try {
        const response = await api.post('/chon-ghe', data);
        return response.data;
    } catch (error) {
        handleError('Lỗi khi đặt ghế:', error);
        return null;
    }
};

export const checkout = async (data) => {
    try {
        const response = await api.post('/Payment/confirm', data);
        return response.data;
    } catch (error) {
        handleError('Lỗi khi thanh toán:', error);
        return null;
    }
};

export const ticket = async (userId) => {
    try {
        const response = await api.get(`/api/v1/Ve-Detail-user/${userId}`);
        return response.data;
    } catch (error) {
        handleError('Lỗi khi lấy thông tin vé:', error);
        return null;
    }
};

export const deleteSeat = async (data) => {
    try {
        const response = await api.delete('/xoa-ghe', { data });
        return response.data;
    } catch (error) {
        handleError('Lỗi khi xoá ghế:', error);
        return null;
    }
};
