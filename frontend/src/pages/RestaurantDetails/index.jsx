import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RestaurantDetails.css';
import axios from 'axios';
import { useCart } from '../../context/CartContext';

const RestaurantDetails = ({ isAuthenticated, setIsAuthenticated }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart, total, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const [restaurantRes, dishesRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/restaurants/${id}`, { withCredentials: true }),
          axios.get(`http://localhost:5000/api/restaurants/${id}/dishes`, { withCredentials: true })
        ]);
        setRestaurant(restaurantRes.data);
        // Convert price strings to numbers
        const formattedDishes = dishesRes.data.map(dish => ({
          ...dish,
          price: parseFloat(dish.price)
        }));
        setDishes(formattedDishes);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
        setError('Failed to load restaurant details');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  const getItemQuantity = (dishId) => {
    const cartItem = cart.find(item => item.id === dishId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      const orderData = {
        restaurantId: parseInt(id),
        items: cart.map(item => ({
          dishId: item.id,
          quantity: item.quantity,
          price: parseFloat(item.price)
        })),
        totalAmount: parseFloat(total)
      };

      await axios.post('http://localhost:5000/api/orders', orderData, {
        withCredentials: true
      });

      alert('Order placed successfully!');
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const formatPrice = (price) => {
    const number = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(number) ? '0.00' : number.toFixed(2);
  };

  if (loading) return <div className="loading">Loading menu...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!restaurant) return <div className="error">Restaurant not found</div>;

  return (
    <div className="restaurant-details-container">
      <div className="cart-section">
        <h2>Your Cart</h2>
        {cart.length > 0 ? (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <span className="cart-item-name">{item.name}</span>
                  <div className="cart-quantity">
                    <button 
                      className="quantity-btn" 
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      className="quantity-btn" 
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="cart-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="place-order-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </>
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>

      <div className="menu-section">
        <h1>Menu</h1>
        <div className="menu-items">
          {dishes.map((dish) => (
            <div key={dish.id} className="menu-item">
              <div className="menu-item-details">
                <h3>{dish.name}</h3>
                <p>{dish.description}</p>
                <span className="price">${dish.price.toFixed(2)}</span>
              </div>
              <button onClick={() => addToCart(dish)} className="add-to-cart-btn">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails; 