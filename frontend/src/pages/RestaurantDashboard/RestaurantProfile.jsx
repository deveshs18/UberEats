import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import './RestaurantDashboard.css';

const RestaurantProfile = ({ restaurant, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    contact_info: '',
    cuisine: '',
    delivery_time: '',
    profilePicture: ''
  });

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        description: restaurant.description || '',
        location: restaurant.location || '',
        contact_info: restaurant.contact_info || '',
        cuisine: restaurant.cuisine || '',
        delivery_time: restaurant.delivery_time || '',
        profilePicture: restaurant.profilePicture || ''
      });
    }
  }, [restaurant]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        'http://localhost:5000/api/restaurants/profile',
        formData,
        { withCredentials: true }
      );
      
      // Pass the complete restaurant object to the parent component
      onProfileUpdate(response.data.restaurant);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!restaurant) return null;

  return (
    <div className="profile-section">
      <div className="profile-header">
        <h2>Restaurant Profile</h2>
        {!isEditing ? (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            <FaEdit /> Edit
          </button>
        ) : (
          <div className="edit-actions">
            <button className="save-btn" onClick={handleSubmit}>
              <FaSave /> Save
            </button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
              <FaTimes /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="profile-content">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-details">
            <div className="form-group">
              <label className="form-label">Restaurant Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Profile Picture URL</label>
              <input
                type="text"
                className="form-control"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="2"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Information</label>
              <input
                type="text"
                className="form-control"
                name="contact_info"
                value={formData.contact_info}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cuisine Type</label>
              <input
                type="text"
                className="form-control"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Time (minutes)</label>
              <input
                type="text"
                className="form-control"
                name="delivery_time"
                value={formData.delivery_time}
                onChange={handleInputChange}
              />
            </div>
          </form>
        ) : (
          <>
            <div className="profile-image">
              <img
                src={restaurant.profilePicture || '/default-restaurant.jpg'}
                alt={restaurant.name}
              />
            </div>
            <div className="profile-details">
              <div className="info-group">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.description}</p>
              </div>
              <div className="info-group">
                <h4>Location</h4>
                <p>{restaurant.location || 'Not specified'}</p>
              </div>
              <div className="info-group">
                <h4>Contact</h4>
                <p>{restaurant.contact_info || 'Not specified'}</p>
              </div>
              <div className="info-group">
                <h4>Cuisine</h4>
                <p>{restaurant.cuisine || 'Not specified'}</p>
              </div>
              <div className="info-group">
                <h4>Delivery Time</h4>
                <p>{restaurant.delivery_time ? `${restaurant.delivery_time} minutes` : 'Not specified'}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantProfile; 