import { useState, useEffect } from 'react';
import axios from 'axios';

const NavbarLogic = ({ setIsAuthenticated, setUserRole }) => {
  const handleLogout = async () => {
    try {
      // Call the correct logout endpoint based on role
      const role = localStorage.getItem('userRole');
      const logoutEndpoint = role === 'restaurant' 
        ? '/api/authRestaurant/logout'
        : '/api/authCustomer/logout';
        
      await axios.post(`http://localhost:5000${logoutEndpoint}`, {}, { 
        withCredentials: true 
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Update auth state
      setIsAuthenticated(false);
      setUserRole(null);

      // Reload the page to clear all states
      window.location.href = '/';
    }
  };

  return {
    handleLogout
  };
};

export default NavbarLogic;