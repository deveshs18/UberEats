import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaClock, FaUtensils, FaSearch } from 'react-icons/fa';
import CustomerDashboardLogic from './CustomerDashboardLogic';
import './CustomerDashboard.css';

const CustomerDashboardStructure = () => {
  const {
    restaurants,
    loading,
    error,
    selectedCuisine,
    setSelectedCuisine,
    searchQuery,
    setSearchQuery,
    handleSearch,
    cuisineTypes
  } = CustomerDashboardLogic();

  const navigate = useNavigate();

  if (loading) return <div className="loading">Loading restaurants...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="customer-dashboard">
      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>
        <div className="cuisine-filters">
          <button
            className={`cuisine-btn ${!selectedCuisine ? 'active' : ''}`}
            onClick={() => setSelectedCuisine(null)}
          >
            All
          </button>
          {cuisineTypes.map(cuisine => (
            <button
              key={cuisine}
              className={`cuisine-btn ${selectedCuisine === cuisine ? 'active' : ''}`}
              onClick={() => setSelectedCuisine(cuisine)}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Categories */}
      <div className="featured-categories">
        <h2>Categories</h2>
        <div className="category-grid">
          {['Indian', 'Chinese', 'Italian', 'Mexican', 'Japanese', 'Thai', 'American', 'Mediterranean'].map(category => (
            <div
              key={category}
              className="category-card"
              onClick={() => setSelectedCuisine(category)}
            >
              <div className="category-icon">
                <FaUtensils />
              </div>
              <span>{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="restaurants-section">
        <h2>Restaurants Near You</h2>
        <div className="restaurants-grid">
          {restaurants.map(restaurant => (
            <div
              key={restaurant.id}
              className="restaurant-card"
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
            >
              <div className="restaurant-image">
                <img
                  src={restaurant.image_url || '/default-restaurant.jpg'}
                  alt={restaurant.name}
                />
                <div className="delivery-time">
                  <FaClock /> {restaurant.delivery_time} min
                </div>
              </div>
              <div className="restaurant-info">
                <h3>{restaurant.name}</h3>
                <p className="cuisine">{restaurant.cuisine}</p>
                <div className="restaurant-meta">
                  <div className="rating">
                    <FaStar className="star-icon" />
                    <span>{restaurant.rating}</span>
                    <span className="review-count">({restaurant.review_count})</span>
                  </div>
                  <div className="price-range">
                    {restaurant.price_range}
                  </div>
                </div>
                <p className="delivery-fee">
                  {restaurant.delivery_fee === 0 ? 'Free Delivery' : `Delivery: $${restaurant.delivery_fee}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardStructure; 