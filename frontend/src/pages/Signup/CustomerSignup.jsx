import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const CustomerSignup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        country: '',
        state: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validation
        if (!formData.name || !formData.email || !formData.password || !formData.country || !formData.state) {
            setError('All fields are required');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:5000/api/authCustomer/signup',
                formData,
                { withCredentials: true }
            );
            
            if (response.data) {
                setSuccess(true);
                // Redirect after 2 seconds
                setTimeout(() => {
                    navigate('/login-customer');
                }, 2000);
            }
        } catch (error) {
            console.error('Signup error:', error);
            setError(error.response?.data?.message || 'Error during signup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h2>Customer Signup</h2>
                {error && <div className="error-message">{error}</div>}
                {success && (
                    <div className="success-message">
                        Signup successful! Redirecting to login...
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Enter your country"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="state">State</label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="Enter your state"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="signup-button"
                        disabled={loading}
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
                <p className="login-link">
                    Already have an account?{' '}
                    <span onClick={() => navigate('/login-customer')}>
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default CustomerSignup; 