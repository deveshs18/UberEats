import React from 'react';
import { FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import NavbarLogic from './NavbarLogic';
import './Navbar.css';

const NavbarStructure = ({ isAuthenticated, userRole, setIsAuthenticated, setUserRole }) => {
  const { handleLogout } = NavbarLogic({ setIsAuthenticated, setUserRole });
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <span className="brand-text"><span style={{ color: "black" }}>Uber</span>Eats</span>
        </Link>
      </div>

      <div className="navbar-right">
        {isAuthenticated && !isHomePage && (
          <button 
            onClick={handleLogout} 
            className="logout-icon-button"
            title="Logout"
          >
            <FaSignOutAlt />
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavbarStructure; 