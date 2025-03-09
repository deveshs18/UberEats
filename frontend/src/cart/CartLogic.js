import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useCart = (restaurantId) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);

  // Fetch cart items when component mounts
  useEffect(() => {
    fetchCartItems();
  }, [restaurantId]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }

      const data = await response.json();
      setCartItems(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (dishId, newQuantity) => {
    try {
      if (newQuantity === 0) {
        const response = await fetch(`http://localhost:5000/api/cart/remove/${dishId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to remove item from cart');
        }

        setCartItems(prev => prev.filter(item => item.id !== dishId));
        return;
      }

      const response = await fetch(`http://localhost:5000/api/cart/update/${dishId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          quantity: newQuantity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update cart quantity');
      }

      setCartItems(prev =>
        prev.map(item =>
          item.id === dishId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating cart:', error);
      setError('Failed to update cart. Please try again.');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setIsPlacingOrder(true);
      setOrderError(null);

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          delivery_address: 'Default Address', // You might want to add an address input field
          notes: ''
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Clear local cart after successful order
      setCartItems([]);
      
      // Navigate to orders page
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return {
    cartItems,
    isLoading,
    error,
    isPlacingOrder,
    orderError,
    handleUpdateQuantity,
    handlePlaceOrder,
    calculateTotal
  };
}; 