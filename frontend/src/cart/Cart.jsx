import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartLogic';
import './Cart.css';

const Cart = ({ restaurantId }) => {
  const navigate = useNavigate();
  const {
    cartItems,
    isLoading,
    error,
    isPlacingOrder,
    orderError,
    handleUpdateQuantity,
    handlePlaceOrder,
    calculateTotal
  } = useCart(restaurantId);

  if (isLoading) return <div className="cart-loading">Loading cart...</div>;
  if (error) return <div className="cart-error">{error}</div>;
  if (!cartItems.length) return null;

  return (
    <div className="cart-summary">
      <h3>Cart Summary</h3>
      {orderError && <div className="error-message">{orderError}</div>}
      
      {cartItems.map(item => (
        <div key={item.id} className="cart-item">
          <div className="cart-item-info">
            <span>{item.name}</span>
            <div className="cart-item-quantity">
              <button 
                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                className="quantity-btn"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                className="quantity-btn"
              >
                +
              </button>
            </div>
          </div>
          <span className="item-total">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}

      <div className="cart-total">
        <span>Total:</span>
        <span>${calculateTotal().toFixed(2)}</span>
      </div>

      <button 
        className={`place-order-btn ${isPlacingOrder ? 'loading' : ''}`}
        onClick={handlePlaceOrder}
        disabled={isPlacingOrder}
      >
        {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
};

export default Cart; 