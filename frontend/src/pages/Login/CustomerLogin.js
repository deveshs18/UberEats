import axios from 'axios';

export const handleCustomerLogin = async (email, password) => {
    try {
        const res = await axios.post('http://localhost:5000/api/authCustomer/login', { email, password });

        console.log('Login response:', res.data);

        if (res.status === 200 && res.data.user) {
            localStorage.setItem('user', JSON.stringify(res.data.user));
            return { success: true, user: res.data.user };
        }
        return { success: false };
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        return { success: false };
    }
};
