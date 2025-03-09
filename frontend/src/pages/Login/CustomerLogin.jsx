import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const CustomerLogin = ({ setIsAuthenticated, setUserRole, setUserName }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            console.log('Attempting login with:', { email });
            const response = await axios.post(
                'http://localhost:5000/api/authCustomer/login',
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    withCredentials: true
                }
            );

            console.log('Login response:', response.data);

            if (response.data.success) {
                setIsAuthenticated(true);
                setUserRole('customer');
                setUserName(response.data.name);
                navigate('/customer-dashboard');
            } else {
                setError(response.data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Failed to login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Customer Login</h2>
                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={() => setError('')}>✕</button>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p>
                    Don't have an account?{' '}
                    <span 
                        className="signup-link"
                        onClick={() => navigate('/signup-customer')}
                    >
                        Sign up
                    </span>
                </p>
            </div>
        </div>
    );
};

export default CustomerLogin;
