const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Restaurant = require('../models/Restaurant');

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    if (!req.session || !req.session.user || !req.session.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.session.user.id;
    const { restaurant_id, total_price } = req.body;

    // Ensure restaurant exists
    const restaurant = await Restaurant.findByPk(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Create new order
    const order = await Order.create({
      customer_id: userId,
      restaurant_id,
      total_price,
      status: 'New',
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
};

// Get details of a specific order
exports.getOrderDetails = async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const userId = req.session.user.id;
    console.log('User ID:', userId);
    console.log('Received orderId:', orderId);
    const order = await Order.findByPk(orderId, {
        where: { customer_id: userId },
      include: [
        { model: Customer, as: 'Customer' },
        { model: Restaurant, as: 'Restaurant' },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error retrieving order details:', error);
    res.status(500).json({ message: 'Error retrieving order', error: error.message });
  }
};

// Get all orders for the authenticated user
exports.getAllOrdersForUser = async (req, res) => {
  try {
    if (!req.session || !req.session.user || !req.session.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.session.user.id;

    const orders = await Order.findAll({
      where: { customer_id: userId },
      include: [{ model: Restaurant, as: 'Restaurant' }],
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ message: 'Error retrieving orders', error: error.message });
  }
};

// Update the status of an order (restaurant user only)
exports.updateOrderStatus = async (req, res) => {
  try {
    if (!req.session || !req.session.user || !req.session.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    // Check if the authenticated user is a restaurant user
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.session.user.id !== order.restaurant_id) {
      return res.status(403).json({ message: 'User not authorized to update this order' });
    }

    // Update the order status
    await order.update({ status });

    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

// Cancel an order (customer user only)
exports.cancelOrder = async (req, res) => {
  try {
    if (!req.session || !req.session.user || !req.session.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { orderId } = req.params;

    // Find the order
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure the authenticated user is the owner of the order
    if (req.session.user.id !== order.customer_id) {
      return res.status(403).json({ message: 'User not authorized to cancel this order' });
    }

    // Cancel the order (soft-delete or change status)
    await order.update({ status: 'Cancelled' });

    res.status(200).json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Error cancelling order', error: error.message });
  }
};
