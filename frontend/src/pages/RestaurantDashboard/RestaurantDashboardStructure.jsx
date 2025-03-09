import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaClock, FaUtensils, FaMapMarkerAlt, FaEdit, FaTrash, FaPlus, FaList, FaClipboardList, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import './RestaurantDashboard.css';
import RestaurantProfile from './RestaurantProfile';
import RestaurantOrders from './RestaurantOrders';

const RestaurantDashboardStructure = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [activeTab, setActiveTab] = useState('menu');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch restaurant details
      const restaurantResponse = await axios.get(
        'http://localhost:5000/api/restaurants/profile',
        { withCredentials: true }
      );
      setRestaurant(restaurantResponse.data);

      // Fetch menu items using restaurant ID
      const menuResponse = await axios.get(
        `http://localhost:5000/api/restaurants/${restaurantResponse.data.id}/dishes`,
        { withCredentials: true }
      );
      setMenuItems(menuResponse.data);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      setLoading(false);
      
      if (err.response?.status === 401) {
        navigate('/login-restaurant');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/authRestaurant/logout', {}, 
        { withCredentials: true }
      );
      localStorage.removeItem('restaurantId');
      localStorage.removeItem('userRole');
      navigate('/login-restaurant');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleAddDish = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/restaurants/${restaurant.id}/dishes`,
        formData,
        { withCredentials: true }
      );
      setShowAddDishModal(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Main Course'
      });
      fetchDashboardData();
    } catch (err) {
      console.error('Error adding dish:', err);
      setError(err.response?.data?.message || 'Failed to add dish');
    }
  };

  const handleUpdateDish = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/restaurants/${restaurant.id}/dishes/${editingDish.id}`,
        formData,
        { withCredentials: true }
      );
      setShowAddDishModal(false);
      setEditingDish(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Main Course'
      });
      fetchDashboardData();
    } catch (err) {
      console.error('Error updating dish:', err);
      setError(err.response?.data?.message || 'Failed to update dish');
    }
  };

  const handleDeleteDish = async (dishId) => {
    if (window.confirm('Are you sure you want to delete this dish?')) {
      try {
        await axios.delete(
          `http://localhost:5000/api/restaurants/${restaurant.id}/dishes/${dishId}`,
          { withCredentials: true }
        );
        fetchDashboardData();
      } catch (err) {
        console.error('Error deleting dish:', err);
        setError(err.response?.data?.message || 'Failed to delete dish');
      }
    }
  };

  const handleEditClick = (dish) => {
    setEditingDish(dish);
    setFormData({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      category: dish.category
    });
    setShowAddDishModal(true);
  };

  const handleProfileUpdate = (updatedRestaurant) => {
    setRestaurant(updatedRestaurant);
  };

  if (loading) return (
    <div className="loading">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Loading restaurant details...</p>
    </div>
  );
  
  if (error) return (
    <div className="error">
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    </div>
  );
  
  if (!restaurant) return (
    <div className="error">
      <div className="alert alert-warning" role="alert">
        Restaurant not found
      </div>
    </div>
  );

  return (
    <div className="restaurant-dashboard container-fluid p-4">
      <div className="row">
        <div className="col-12">
          <RestaurantProfile 
            restaurant={restaurant} 
            onProfileUpdate={handleProfileUpdate} 
          />
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          <FaList /> Menu Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <FaClipboardList /> Orders Management
        </button>
      </div>

      {activeTab === 'menu' ? (
        <div className="row">
          <div className="col-12">
            <div className="dashboard-menu-section">
              <div className="menu-header">
                <h2>Menu Management</h2>
                <button 
                  className="add-dish-btn" 
                  onClick={() => {
                    setEditingDish(null);
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      category: 'Main Course'
                    });
                    setShowAddDishModal(true);
                  }}
                >
                  <FaPlus /> Add New Dish
                </button>
              </div>

              <div className="menu-grid">
                {menuItems.map(dish => (
                  <div key={dish.id} className="menu-item">
                    <div className="item-info">
                      <h3>{dish.name}</h3>
                      <p className="description">{dish.description}</p>
                      <div className="item-footer">
                        <span className="price">${Number(dish.price).toFixed(2)}</span>
                        <div className="item-actions">
                          <button 
                            className="btn-edit"
                            onClick={() => handleEditClick(dish)}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteDish(dish.id)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <RestaurantOrders />
          </div>
        </div>
      )}

      {showAddDishModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingDish ? 'Edit Dish' : 'Add New Dish'}</h2>
            <form onSubmit={editingDish ? handleUpdateDish : handleAddDish}>
              <div className="form-group">
                <label>Name</label>
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
                <label>Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-select"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Main Course">Main Course</option>
                  <option value="Appetizer">Appetizer</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-btn">
                  {editingDish ? 'Update Dish' : 'Add Dish'}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddDishModal(false);
                    setEditingDish(null);
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      category: 'Main Course'
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboardStructure; 