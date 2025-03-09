import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantLogin = ({ setIsAuthenticated, setUserRole }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/authRestaurant/login',
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setIsAuthenticated(true);
        setUserRole('restaurant');
        navigate('/restaurant-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // ... rest of the component code ...
};

export default RestaurantLogin;
