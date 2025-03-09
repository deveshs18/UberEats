import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaClock, FaTruck, FaTimes, FaFilter, FaSearch, FaEdit } from 'react-icons/fa';
import './RestaurantOrders.css';

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});

  // Valid status transitions
  const validTransitions = {
    'New': ['Preparing', 'Cancelled'],
    'Preparing': ['On the Way', 'Cancelled'],
    'On the Way': ['Delivered', 'Cancelled'],
    'Delivered': [], // No further transitions
    'Cancelled': [] // No further transitions
  };

  useEffect(() => {
    fetchOrders();
    // Set up periodic refresh
    const refreshInterval = setInterval(fetchOrders, 30000); // Refresh every 30 seconds
    return () => clearInterval(refreshInterval);
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setError(null);
      const url = `http://localhost:5000/api/orders/restaurant${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`;
      const response = await axios.get(url, { withCredentials: true });
      
      // Sort orders by date (newest first)
      const sortedOrders = response.data.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      
      setOrders(sortedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders');
      
      // Handle session expiration
      if (err.response?.status === 401) {
        window.location.href = '/login-restaurant';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      setError(null);
      
      // Find current order
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Validate status transition
      if (!validTransitions[order.status]?.includes(newStatus)) {
        throw new Error(`Invalid status transition from ${order.status} to ${newStatus}`);
      }

      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      
      // Update order locally first for immediate feedback
      setOrders(prevOrders => 
        prevOrders.map(o => 
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );
      
      // Then refresh all orders
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err.message || 'Failed to update order status');
      
      if (err.response?.status === 401) {
        window.location.href = '/login-restaurant';
      }
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FaClock className="status-icon pending" />;
      case 'Preparing':
        return <FaCheck className="status-icon preparing" />;
      case 'On the Way':
        return <FaTruck className="status-icon on-way" />;
      case 'Delivered':
        return <FaCheck className="status-icon delivered" />;
      case 'Cancelled':
        return <FaTimes className="status-icon cancelled" />;
      default:
        return null;
    }
  };

  const getAvailableStatuses = (currentStatus) => {
    const allStatuses = ['Pending', 'Preparing', 'On the Way', 'Delivered', 'Cancelled'];
    if (currentStatus === 'Delivered' || currentStatus === 'Cancelled') {
      return [];
    }
    return allStatuses.filter(status => 
      validTransitions[currentStatus]?.includes(status)
    );
  };

  const handleStatusSelect = (orderId, status) => {
    setSelectedStatus(prev => ({
      ...prev,
      [orderId]: status
    }));
  };

  const getStatusActions = (order) => {
    switch (order.status) {
      case 'New':
        return (
          <div className="order-actions">
            <button
              className="status-btn accept"
              onClick={() => handleStatusUpdate(order.id, 'Preparing')}
              disabled={updatingOrder === order.id}
            >
              {updatingOrder === order.id ? 'Accepting...' : 'Accept Order'}
            </button>
            <button
              className="status-btn reject"
              onClick={() => handleStatusUpdate(order.id, 'Cancelled')}
              disabled={updatingOrder === order.id}
            >
              {updatingOrder === order.id ? 'Rejecting...' : 'Reject Order'}
            </button>
          </div>
        );
      case 'Preparing':
        return (
          <div className="order-actions">
            <button
              className="status-btn delivery"
              onClick={() => handleStatusUpdate(order.id, 'On the Way')}
              disabled={updatingOrder === order.id}
            >
              {updatingOrder === order.id ? 'Updating...' : 'Mark Out for Delivery'}
            </button>
            <button
              className="status-btn reject"
              onClick={() => handleStatusUpdate(order.id, 'Cancelled')}
              disabled={updatingOrder === order.id}
            >
              {updatingOrder === order.id ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </div>
        );
      case 'On the Way':
        return (
          <div className="order-actions">
            <button
              className="status-btn complete"
              onClick={() => handleStatusUpdate(order.id, 'Delivered')}
              disabled={updatingOrder === order.id}
            >
              {updatingOrder === order.id ? 'Updating...' : 'Mark as Delivered'}
            </button>
            <button
              className="status-btn reject"
              onClick={() => handleStatusUpdate(order.id, 'Cancelled')}
              disabled={updatingOrder === order.id}
            >
              {updatingOrder === order.id ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </div>
        );
      case 'Delivered':
      case 'Cancelled':
        return null;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.Customer.name.toLowerCase().includes(searchLower) ||
      order.id.toString().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="restaurant-orders">
      <div className="orders-header">
        <h2>Order Management</h2>
        <div className="orders-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <FaFilter className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="On the Way">On the Way</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found</p>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map(order => (
            <div key={order.id} className={`order-card ${order.status.toLowerCase().replace(' ', '-')}`}>
              <div className="order-header">
                <div className="order-id">Order #{order.id}</div>
                <div className="order-status">
                  {getStatusIcon(order.status)}
                  <span>{order.status}</span>
                </div>
              </div>

              <div className="order-time">
                Ordered: {formatDate(order.created_at)}
              </div>

              <div className="customer-details">
                <h4>Customer Details</h4>
                <p>{order.Customer.name}</p>
                <p>{order.Customer.email}</p>
              </div>

              <div className="order-items">
                <h4>Order Items</h4>
                {order.orderItems.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="item-name">{item.dish.name}</div>
                    <div className="item-quantity">x{item.quantity}</div>
                  </div>
                ))}
              </div>

              <div className="order-total">
                Total Amount: ${Number(order.total_amount).toFixed(2)}
              </div>

              <div className="order-actions">
                {getStatusActions(order)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders; 