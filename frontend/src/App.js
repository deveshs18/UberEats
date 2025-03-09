import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home/Home.jsx';
import CustomerLogin from './pages/Login/CustomerLogin.jsx';
import RestaurantLogin from './pages/Login/RestaurantLogin.jsx';
import CustomerSignup from './pages/Signup/CustomerSignup.jsx';
import RestaurantSignup from './pages/Signup/RestaurantSignup.jsx';
import CustomerDashboard from './pages/CustomerDashboard/CustomerDashboard.jsx';
import RestaurantDashboardStructure from './pages/RestaurantDashboard/RestaurantDashboardStructure.jsx';
import RestaurantDetails from './pages/RestaurantDetails/index.jsx';
import Orders from './pages/Orders/Orders.jsx';
import Profile from './pages/Profile/Profile.jsx';
import NavbarStructure from './components/Navbar/NavbarStructure';
import SidebarStructure from './components/Sidebar/SidebarStructure';
import Favorites from './pages/Favorites/Favorites';
import './App.css';
import axios from 'axios';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/check-auth', {
        withCredentials: true
      });
      
      console.log('Auth check response:', response.data);
      
      if (response.data.isAuthenticated) {
        setIsAuthenticated(true);
        setUserRole(response.data.userRole);
        setUserName(response.data.userName);
        // Only adjust sidebar if user is a customer
        if (response.data.userRole === 'customer') {
          setIsSidebarOpen(window.innerWidth > 768);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
        setUserName('');
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
      setUserRole(null);
      setUserName('');
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (userRole === 'customer') {
        setIsSidebarOpen(window.innerWidth > 768);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [userRole]);

  useEffect(() => {
    if (userRole === 'customer') {
      setIsSidebarOpen(window.innerWidth > 768);
    } else {
      setIsSidebarOpen(false);
    }
  }, [userRole]);

  const ProtectedRoute = ({ element, role }) => {
    if (!isAuthenticated) {
      return <Navigate to={role === 'restaurant' ? '/login-restaurant' : '/login-customer'} />;
    }

    if (role && userRole !== role) {
      return <Navigate to="/" />;
    }

    return element;
  };

  const shouldShowSidebar = isAuthenticated && userRole === 'customer';

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        withCredentials: true
      });
      setIsAuthenticated(false);
      setUserRole(null);
      setUserName('');
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <CartProvider>
      <Router>
        <div className="app">
          <NavbarStructure 
            isAuthenticated={isAuthenticated} 
            userRole={userRole}
            setIsAuthenticated={setIsAuthenticated}
            setUserRole={setUserRole}
          />
          {shouldShowSidebar && (
            <SidebarStructure 
              isOpen={isSidebarOpen}
              setIsOpen={setIsSidebarOpen}
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              userName={userName}
              handleLogout={handleLogout}
            />
          )}
          <main className={`main-content ${shouldShowSidebar && isSidebarOpen ? 'sidebar-open' : ''}`}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route 
                path="/login-customer" 
                element={
                  <CustomerLogin 
                    setIsAuthenticated={setIsAuthenticated} 
                    setUserRole={setUserRole}
                    setUserName={setUserName}
                  />
                } 
              />
              <Route 
                path="/login-restaurant" 
                element={
                  <RestaurantLogin 
                    setIsAuthenticated={setIsAuthenticated} 
                    setUserRole={setUserRole}
                  />
                } 
              />
              <Route path="/signup-customer" element={<CustomerSignup />} />
              <Route path="/signup-restaurant" element={<RestaurantSignup />} />
              <Route path="/restaurant/:id" element={<RestaurantDetails />} />
              
              {/* Protected Customer Routes */}
              <Route 
                path="/customer-dashboard" 
                element={
                  <ProtectedRoute 
                    element={
                      <CustomerDashboard 
                        isAuthenticated={isAuthenticated} 
                        userRole={userRole}
                      />
                    } 
                    role="customer" 
                  />
                } 
              />
              <Route 
                path="/orders" 
                element={<ProtectedRoute element={<Orders />} role="customer" />} 
              />
              <Route 
                path="/favorites" 
                element={<ProtectedRoute element={<Favorites />} role="customer" />} 
              />
              
              {/* Protected Restaurant Routes */}
              <Route 
                path="/restaurant-dashboard" 
                element={<ProtectedRoute element={<RestaurantDashboardStructure />} role="restaurant" />} 
              />
              
              {/* Shared Protected Routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute 
                    element={
                      <Profile 
                        setUserName={setUserName}
                      />
                    } 
                  />
                } 
              />
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
