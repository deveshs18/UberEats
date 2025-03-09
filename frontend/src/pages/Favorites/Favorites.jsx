import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import RestaurantCard from '../../components/RestaurantCard';
import './Favorites.css';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            // First get the list of favorite IDs
            const favoritesResponse = await axios.get('http://localhost:5000/api/customers/favorites', {
                withCredentials: true
            });
            
            if (!favoritesResponse.data) {
                setError('Failed to load favorites');
                setLoading(false);
                return;
            }

            // Get all restaurants
            const restaurantsResponse = await axios.get('http://localhost:5000/api/restaurants', {
                withCredentials: true
            });

            // Get the favorite IDs from the response
            const favoriteIds = favoritesResponse.data.map(fav => fav.restaurant_id);
            
            // Filter restaurants to only include favorites
            const favoriteRestaurants = restaurantsResponse.data.filter(restaurant => 
                favoriteIds.includes(restaurant.id)
            );
            
            setFavorites(favoriteRestaurants);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            if (error.response?.status === 401) {
                setError('Please login to view favorites');
            } else {
                setError('Failed to load favorites');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    if (loading) {
        return (
            <div className="favorites-container loading">
                <div className="loader"></div>
                <p>Loading your favorites...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="favorites-container error">
                <p>{error}</p>
                {error.includes('login') && (
                    <Link to="/login-customer" className="login-link">
                        Login Now
                    </Link>
                )}
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="favorites-container empty">
                <h2>No Favorites Yet</h2>
                <p>Start adding restaurants to your favorites!</p>
                <Link to="/" className="browse-link">Browse Restaurants</Link>
            </div>
        );
    }

    return (
        <div className="favorites-container">
            <h2>My Favorite Restaurants</h2>
            <div className="favorites-grid">
                {favorites.map(restaurant => (
                    <RestaurantCard
                        key={restaurant.id}
                        restaurant={restaurant}
                        onFavoriteChange={fetchFavorites}
                        initialFavoriteState={true}
                    />
                ))}
            </div>
        </div>
    );
};

export default Favorites; 