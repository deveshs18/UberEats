import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import './Menu.css';
import axios from 'axios';

const Menu = ({ restaurantId }) => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/restaurants/${restaurantId}/dishes`,
                    { withCredentials: true }
                );
                setDishes(response.data);
            } catch (error) {
                console.error('Error fetching dishes:', error);
                setError('Failed to load menu');
            } finally {
                setLoading(false);
            }
        };

        fetchDishes();
    }, [restaurantId]);

    const handleAddToCart = (dishId) => {
        setCart(prevCart => ({
            ...prevCart,
            [dishId]: (prevCart[dishId] || 0) + 1
        }));
    };

    const handleRemoveFromCart = (dishId) => {
        setCart(prevCart => {
            const updatedCart = { ...prevCart };
            if (updatedCart[dishId] > 1) {
                updatedCart[dishId] -= 1;
            } else {
                delete updatedCart[dishId];
            }
            return updatedCart;
        });
    };

    const calculateTotal = () => {
        return Object.entries(cart).reduce((total, [dishId, quantity]) => {
            const dish = dishes.find(d => d.id === parseInt(dishId));
            return total + (parseFloat(dish.price) * quantity);
        }, 0).toFixed(2);
    };

    const handleCheckout = () => {
        if (Object.keys(cart).length === 0) {
            alert('Please add items to cart before checking out');
            return;
        }
        // Save cart to localStorage or context
        localStorage.setItem('currentCart', JSON.stringify({
            items: cart,
            total: calculateTotal()
        }));
        navigate('/cart');
    };

    const groupedDishes = dishes.reduce((acc, dish) => {
        if (!acc[dish.category]) {
            acc[dish.category] = [];
        }
        acc[dish.category].push(dish);
        return acc;
    }, {});

    return (
        <div className="menu-container">
            <div className="menu-items">
                {Object.entries(groupedDishes).map(([category, categoryDishes]) => (
                    <div key={category} className="menu-category">
                        <h2>{category}</h2>
                        <div className="dishes-grid">
                            {categoryDishes.map(dish => (
                                <div key={dish.id} className="dish-card">
                                    <div className="dish-image">
                                        <img 
                                            src={dish.image || '/default-dish.jpg'} 
                                            alt={dish.name}
                                            onError={(e) => {
                                                e.target.src = '/default-dish.jpg';
                                            }}
                                        />
                                    </div>
                                    <div className="dish-info">
                                        <h3>{dish.name}</h3>
                                        <p className="dish-description">{dish.description}</p>
                                        <p className="dish-ingredients">
                                            <small>{dish.ingredients}</small>
                                        </p>
                                        <div className="dish-price-actions">
                                            <span className="price">${dish.price}</span>
                                            <div className="quantity-controls">
                                                {cart[dish.id] > 0 && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleRemoveFromCart(dish.id)}
                                                            className="quantity-btn"
                                                        >
                                                            <FaMinus />
                                                        </button>
                                                        <span className="quantity">{cart[dish.id]}</span>
                                                    </>
                                                )}
                                                <button 
                                                    onClick={() => handleAddToCart(dish.id)}
                                                    className="quantity-btn add"
                                                >
                                                    <FaPlus />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            {Object.keys(cart).length > 0 && (
                <div className="cart-summary">
                    <div className="cart-details">
                        <h3>Cart Summary</h3>
                        {Object.entries(cart).map(([dishId, quantity]) => {
                            const dish = dishes.find(d => d.id === parseInt(dishId));
                            return (
                                <div key={dishId} className="cart-item">
                                    <span>{dish.name} x {quantity}</span>
                                    <span>${(parseFloat(dish.price) * quantity).toFixed(2)}</span>
                                </div>
                            );
                        })}
                        <div className="cart-total">
                            <strong>Total:</strong>
                            <strong>${calculateTotal()}</strong>
                        </div>
                    </div>
                    <button 
                        className="checkout-button"
                        onClick={handleCheckout}
                    >
                        <FaShoppingCart /> Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Menu; 