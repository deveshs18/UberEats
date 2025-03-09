// src/services/authService.js
import axios from 'axios';

export const handleSignup = async (email, password, role) => {
    try {
        const res = await axios.post('http://localhost:5000/signup', { email, password, role });
        return res.data.success;
    } catch (error) {
        console.error('Signup failed:', error);
        return false;
    }
};