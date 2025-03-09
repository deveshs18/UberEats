import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from '../../components/RestaurantCard';
import CategoryButtons from '../../components/CategoryButtons';
import './CustomerDashboard.css';

const CustomerDashboard = ({ isAuthenticated, userRole }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCuisine, setSelectedCuisine] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || userRole !== 'customer') {
            navigate('/login-customer');
            return;
        }

        const fetchRestaurants = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5000/api/restaurants',
                    { withCredentials: true }
                );
                // Ensure cuisine is never null
                const restaurantsWithDefaultCuisine = response.data.map(restaurant => ({
                    ...restaurant,
                    cuisine: restaurant.cuisine || 'Other'
                }));
                setRestaurants(restaurantsWithDefaultCuisine);
                setError(null);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                setError('Failed to load restaurants');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [isAuthenticated, userRole, navigate]);

    // Get unique cuisines, ensuring no null values
    const cuisines = ['all', ...new Set(restaurants.map(restaurant => restaurant.cuisine).filter(Boolean))];
    
    const navigateToCategory = (cuisine) => {
        setSelectedCuisine(cuisine);
    };

    const filteredRestaurants = selectedCuisine === 'all'
        ? restaurants
        : restaurants.filter(restaurant => 
            restaurant.cuisine && restaurant.cuisine.toLowerCase() === selectedCuisine.toLowerCase()
        );

    if (loading) return <div className="loading">Loading restaurants...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!restaurants.length) return <div className="no-restaurants">No restaurants found</div>;

    return (
        <div className="customer-dashboard">
            <CategoryButtons navigateToCategory={navigateToCategory} />
            <div className="cuisine-filter">
                <button
                    className={`cuisine-btn ${selectedCuisine === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedCuisine('all')}
                >
                    All Cuisines
                </button>
                {cuisines
                    .filter(cuisine => cuisine !== 'all')
                    .map(cuisine => (
                        <button
                            key={cuisine}
                            className={`cuisine-btn ${selectedCuisine === cuisine.toLowerCase() ? 'active' : ''}`}
                            onClick={() => setSelectedCuisine(cuisine.toLowerCase())}
                        >
                            {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                        </button>
                    ))
                }
            </div>
            <div className="restaurants-grid">
                {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map(restaurant => (
                        <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                            isAuthenticated={isAuthenticated}
                            userRole={userRole}
                        />
                    ))
                ) : (
                    <div className="no-restaurants">No restaurants found for this cuisine type</div>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;
