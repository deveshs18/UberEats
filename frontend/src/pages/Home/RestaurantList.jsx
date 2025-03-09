import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart } from 'react-icons/fa';
import './RestaurantList.css';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchRestaurants();
    fetchFavorites();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/restaurants', {
        credentials: 'include'
      });
      const data = await response.json();
      setRestaurants(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Failed to load restaurants');
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/customers/favorites', {
        credentials: 'include'
      });
      const data = await response.json();
      setFavorites(data.map(fav => fav.restaurant_id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (restaurantId) => {
    try {
      const isFavorite = favorites.includes(restaurantId);
      const method = isFavorite ? 'DELETE' : 'POST';
      
      const response = await fetch(
        `http://localhost:5000/api/customers/favorites/${restaurantId}`,
        {
          method,
          credentials: 'include'
        }
      );

      if (response.ok) {
        setFavorites(prev => 
          isFavorite 
            ? prev.filter(id => id !== restaurantId)
            : [...prev, restaurantId]
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) return <div className="loading">Loading restaurants...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="restaurant-list">
      <div className="restaurant-grid">
        {restaurants.map(restaurant => (
          <div key={restaurant.id} className="restaurant-card">
            <Link to={`/restaurant/${restaurant.id}`} className="restaurant-link">
              <div className="restaurant-image">
                <img src={restaurant.profilePicture} alt={restaurant.name} />
                <button 
                  className={`favorite-btn ${favorites.includes(restaurant.id) ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(restaurant.id);
                  }}
                >
                  <FaHeart />
                </button>
              </div>
              <div className="restaurant-info">
                <h3>{restaurant.name}</h3>
                <div className="restaurant-rating">
                  <FaStar className="star-icon" />
                  <span>{restaurant.rating || '4.5'}</span>
                </div>
                <p className="restaurant-cuisine">{restaurant.cuisine}</p>
                <div className="restaurant-meta">
                  <span>${restaurant.priceRange}</span>
                  <span>•</span>
                  <span>{restaurant.deliveryTime} min</span>
                </div>
                <p className="restaurant-description">{restaurant.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList; 