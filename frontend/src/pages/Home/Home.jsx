// src/pages/Home/Home.jsx
import React, { useState, useEffect } from 'react';
import './Home.css';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';

const Home = ({ isAuthenticated, userRole }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLoginDropdown, setShowLoginDropdown] = useState(false);
    const [showSignupDropdown, setShowSignupDropdown] = useState(false);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5000/api/restaurants',
                    { withCredentials: true }
                );
                setRestaurants(response.data);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                setError('Failed to load restaurants');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setShowLoginDropdown(false);
                setShowSignupDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Redirect authenticated users to their respective dashboards
    if (isAuthenticated) {
        if (userRole === 'customer') {
            return <Navigate to="/customer-dashboard" />;
        } else if (userRole === 'restaurant') {
            return <Navigate to="/restaurant-dashboard" />;
        }
    }

    return (
        <div className="home-container">
            <div className="home-content">
                <div className="home-left">
                    <h1>
                        Crave. Order. <span style={{ color: "green" }}>Enjoy.</span>
                    </h1>
                    <p>Order your favorite food or manage your restaurant!</p>
                </div>
                <div className="home-right">
                    <div className="login-card">
                        <h2>Welcome!</h2>
                        
                        <div className="dropdown-section">
                            <div className="dropdown-container">
                                <button 
                                    className="dropdown-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowLoginDropdown(!showLoginDropdown);
                                        setShowSignupDropdown(false);
                                    }}
                                >
                                    Login
                                </button>
                                {showLoginDropdown && (
                                    <div className="dropdown-content">
                                        <Link to="/login-customer" className="dropdown-item">
                                            Login as Customer
                                        </Link>
                                        <Link to="/login-restaurant" className="dropdown-item">
                                            Login as Restaurant
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="dropdown-container">
                                <button 
                                    className="dropdown-button outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSignupDropdown(!showSignupDropdown);
                                        setShowLoginDropdown(false);
                                    }}
                                >
                                    Sign Up
                                </button>
                                {showSignupDropdown && (
                                    <div className="dropdown-content">
                                        <Link to="/signup-customer" className="dropdown-item">
                                            Sign Up as Customer
                                        </Link>
                                        <Link to="/signup-restaurant" className="dropdown-item">
                                            Sign Up as Restaurant
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;