import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatAmount = (amount) => {
        if (amount === null || amount === undefined) return '0.00';
        const num = parseFloat(amount);
        return isNaN(num) ? '0.00' : num.toFixed(2);
    };

    const getStatusClass = (status) => {
        const statusMap = {
            'New': 'new',
            'Preparing': 'preparing',
            'On the Way': 'on-way',
            'Pick-up Ready': 'ready',
            'Delivered': 'delivered',
            'Picked Up': 'picked-up',
            'Cancelled': 'cancelled'
        };
        return statusMap[status] || 'new';
    };

    const fetchOrders = async () => {
        try {
            console.log('Fetching orders...');
            const response = await axios.get('http://localhost:5000/api/orders/customer', {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            console.log('Fetched orders response:', response);
            
            if (response.data) {
                setOrders(response.data);
                setError(null);
            } else {
                setError('No orders data received');
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            if (err.response?.status === 401) {
                setError('Please login to view orders');
                // Optionally redirect to login
                // window.location.href = '/login-customer';
            } else {
                setError(err.response?.data?.message || 'Failed to fetch orders');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            console.log('Attempting to cancel order:', orderId);
            const response = await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            console.log('Cancel order response:', response);
            if (response.status === 200) {
                await fetchOrders(); // Refresh orders after cancellation
                alert('Order cancelled successfully');
            }
        } catch (err) {
            console.error('Error cancelling order:', err);
            if (err.response?.status === 401) {
                alert('Please login to cancel orders');
                // Optionally redirect to login page
                // window.location.href = '/login-customer';
            } else if (err.response?.status === 404) {
                console.error('Route not found:', err.response);
                alert('Error: Unable to cancel order. Please try again later.');
            } else {
                alert('Failed to cancel order: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <div className="orders-loading">Loading orders...</div>;
    if (error) return <div className="orders-error">{error}</div>;

    return (
        <div className="orders-container">
            <h2>Your Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <h3>Order #{order.id}</h3>
                                <span className={`order-status ${getStatusClass(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="order-details">
                                <p>Restaurant: {order.Restaurant?.name}</p>
                                <p>Date: {new Date(order.created_at).toLocaleString()}</p>
                                <p>Total Amount: ${formatAmount(order.total_amount)}</p>
                            </div>
                            <div className="order-items">
                                {order.orderItems?.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <span>{item.dish?.name}</span>
                                        <span>x{item.quantity}</span>
                                        <span>${(item.price_at_time * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            {order.status === 'New' && (
                                <div className="order-actions">
                                    <button 
                                        className="cancel-button"
                                        onClick={() => handleCancelOrder(order.id)}
                                    >
                                        Cancel Order
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;  
