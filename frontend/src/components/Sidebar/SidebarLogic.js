import { useState, useEffect } from 'react';
import axios from 'axios';

const SidebarLogic = ({ isAuthenticated, userRole }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      // Get user info from the session
      axios.get('http://localhost:5000/api/user/info', { 
        withCredentials: true 
      })
      .then(response => {
        setUserName(response.data.name || 'User');
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
        setUserName('User');
      });
    }
  }, [isAuthenticated]);

  return {
    userName
  };
};

export default SidebarLogic; 