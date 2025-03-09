import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart } from 'react-icons/fa';
import axios from 'axios';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant, onFavoriteChange, initialFavoriteState = false }) => {
    const [isFavorite, setIsFavorite] = useState(initialFavoriteState);

    useEffect(() => {
        // Check if this restaurant is in favorites when component mounts
        const checkFavoriteStatus = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/customers/favorites', {
                    withCredentials: true
                });
                const favorites = response.data;
                const isRestaurantFavorite = favorites.some(fav => fav.restaurant_id === restaurant.id);
                setIsFavorite(isRestaurantFavorite);
            } catch (error) {
                console.error('Error checking favorite status:', error);
            }
        };
        checkFavoriteStatus();
    }, [restaurant.id]);

    const toggleFavorite = async (e) => {
        e.preventDefault(); // Prevent triggering Link click
        e.stopPropagation(); // Stop event from bubbling up
        try {
            if (!isFavorite) {
                await axios.post(`http://localhost:5000/api/customers/favorites/${restaurant.id}`, {}, {
                    withCredentials: true
                });
            } else {
                await axios.delete(`http://localhost:5000/api/customers/favorites/${restaurant.id}`, {
                    withCredentials: true
                });
            }
            setIsFavorite(!isFavorite);
            if (onFavoriteChange) {
                onFavoriteChange();
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            if (error.response?.status === 401) {
                alert('Please login to add favorites');
            }
        }
    };

    return (
        <div className="restaurant-card">
            <Link to={`/restaurant/${restaurant.id}`} className="restaurant-link">
                <div className="restaurant-image">
                    <img 
                        src={restaurant.image_url || 'https://via.placeholder.com/300x200'} 
                        alt={restaurant.name}
                    />
                </div>
                <div className="restaurant-info">
                    <h3>{restaurant.name}</h3>
                    <p className="cuisine">{restaurant.cuisine || restaurant.cuisine_type}</p>
                    <div className="rating-container">
                        <div className="rating">
                            <FaStar className="star-icon" />
                            <span>{restaurant.rating || '4.5'}</span>
                        </div>
                        <button 
                            onClick={toggleFavorite}
                            className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
                            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <FaHeart />
                        </button>
                        <p className="price">{'$'.repeat(restaurant.price_range || restaurant.price_level || 2)}</p>
                    </div>
                    <button className="view-menu-btn">
                        VIEW MENU
                    </button>
                </div>
            </Link>
        </div>
    );
};

export default RestaurantCard;
