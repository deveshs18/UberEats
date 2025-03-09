import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Change if backend URL differs

export const apiRequest = async (method, endpoint, data = {}, token = null) => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios({
            method,
            url: `${API_BASE_URL}${endpoint}`,
            data,
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};
