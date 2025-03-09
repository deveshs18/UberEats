import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const RestaurantSignup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        description: '',
        location: '',
        contact_info: '',
        cuisine: ''
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
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('All required fields must be filled');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:5000/api/authRestaurant/signup',
                formData,
                { withCredentials: true }
            );
            
            if (response.data) {
                setSuccess(true);
                // Redirect after 2 seconds
                setTimeout(() => {
                    navigate('/login-restaurant');
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
                <h2>Restaurant Signup</h2>
                {error && <div className="error-message">{error}</div>}
                {success && (
                    <div className="success-message">
                        Restaurant signup successful! Redirecting to login...
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Restaurant Name*</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter restaurant name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter business email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cuisine">Cuisine Type</label>
                        <input
                            type="text"
                            id="cuisine"
                            name="cuisine"
                            value={formData.cuisine}
                            onChange={handleChange}
                            placeholder="e.g., Italian, Indian, Mexican"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter restaurant location"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description of your restaurant"
                            rows="3"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password*</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password*</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            required
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
                    <span onClick={() => navigate('/login-restaurant')}>
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default RestaurantSignup; 