// src/pages/Signup/Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const API_BASE_URL = 'http://localhost:5000/api';

    const handleSignup = async () => {
        try {
            setError('');
            setLoading(true);
            const endpoint = role === 'customer' ? '/authCustomer/signup' : '/authRestaurant/signup';
            const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
                name,
                email,
                password,
            });

            if (response.status === 201) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate(role === 'customer' ? '/customer-dashboard' : '/restaurant-dashboard');
            } else {
                setError('Unexpected response from server');
            }
        } catch (error) {
            console.error('Signup error:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError('All fields are required.');
            return;
        }
        handleSignup();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="customer">Customer</option>
                <option value="restaurant">Restaurant Owner</option>
            </select>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Signup'}</button>
        </form>
    );
};

export default SignupForm;
