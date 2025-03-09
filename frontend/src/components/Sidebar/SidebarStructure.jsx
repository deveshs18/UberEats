import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaUser, FaClipboardList } from 'react-icons/fa';
import './Sidebar.css';

const SidebarStructure = ({ isOpen, setIsOpen, isAuthenticated, userRole, userName, handleLogout }) => {
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLinkClick = () => {
        if (window.innerWidth <= 768) {
            setIsOpen(false);
        }
    };

    if (!isAuthenticated || userRole !== 'customer') {
        return null;
    }

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <button className="toggle-button" onClick={toggleSidebar}>
                    {isOpen ? '×' : '☰'}
                </button>
                <div className="sidebar-content">
                    <div className="user-info">
                        <FaUser className="user-icon" />
                        <span>{userName || 'Guest'}</span>
                    </div>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/customer-dashboard" onClick={handleLinkClick}>
                                    <FaShoppingCart /> Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" onClick={handleLinkClick}>
                                    <FaClipboardList /> Orders
                                </Link>
                            </li>
                            <li>
                                <Link to="/favorites" onClick={handleLinkClick}>
                                    <FaHeart /> Favorites
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile" onClick={handleLinkClick}>
                                    <FaUser /> Profile
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
            {isOpen && <div className="sidebar-backdrop" onClick={toggleSidebar}></div>}
        </>
    );
};

export default SidebarStructure; 