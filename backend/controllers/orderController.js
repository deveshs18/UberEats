const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Dish = require('../models/Dish');
const Customer = require('../models/Customer');
const Restaurant = require('../models/Restaurant');

// Create order directly from items
exports.createOrder = async (req, res) => {
    try {
        console.log('Creating order with body:', req.body);
        console.log('User session:', req.session);
        
        const customerId = req.session.user.id;
        const { items, restaurantId, totalAmount } = req.body;

        if (!items || !items.length) {
            return res.status(400).json({ message: 'No items provided' });
        }

        // Create order
        const order = await Order.create({
            customer_id: customerId,
            restaurant_id: restaurantId,
            total_amount: totalAmount,
            status: 'New'
        });

        // Create order items
        for (const item of items) {
            await OrderItem.create({
                order_id: order.id,
                dish_id: item.dishId,
                quantity: item.quantity,
                price_at_time: item.price
            });
        }

        res.status(201).json({
            message: 'Order created successfully',
            order_id: order.id
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ 
            message: 'Error creating order', 
            error: error.message 
        });
    }
};

// Get customer's order history
exports.getCustomerOrders = async (req, res) => {
    try {
        const customerId = req.session.user.id;
        const orders = await Order.findAll({
            where: { customer_id: customerId },
            include: [
                {
                    model: Restaurant,
                    as: 'Restaurant',
                    attributes: ['name', 'profilePicture']
                },
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [{
                        model: Dish,
                        as: 'dish',
                        attributes: ['name', 'image']
                    }]
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ 
            message: 'Error fetching orders', 
            error: error.message 
        });
    }
};

// Get restaurant's orders
exports.getRestaurantOrders = async (req, res) => {
    try {
        const restaurantId = req.session.user.id;
        const { status } = req.query;

        const whereClause = { restaurant_id: restaurantId };
        if (status) {
            whereClause.status = status;
        }

        const orders = await Order.findAll({
            where: whereClause,
            include: [
                {
                    model: Customer,
                    as: 'Customer',
                    attributes: ['name', 'email']
                },
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [{
                        model: Dish,
                        as: 'dish',
                        attributes: ['name', 'image']
                    }]
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching restaurant orders:', error);
        res.status(500).json({ 
            message: 'Error fetching orders', 
            error: error.message 
        });
    }
};

// Update order status (for restaurant)
exports.updateOrderStatus = async (req, res) => {
    try {
        const restaurantId = req.session.user.id;
        const { order_id } = req.params;
        const { status } = req.body;

        const order = await Order.findOne({
            where: { 
                id: order_id,
                restaurant_id: restaurantId
            }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ 
            message: 'Error updating order status', 
            error: error.message 
        });
    }
};

// Cancel order (for customer)
exports.cancelOrder = async (req, res) => {
    try {
        console.log('[DEBUG] Cancel Order:');
        console.log('OrderId:', req.orderId);
        console.log('Customer:', req.session?.user?.id);

        // Find the order
        const order = await Order.findOne({
            where: { 
                id: req.orderId,
                customer_id: req.session.user.id
            }
        });

        // If order not found, return 404
        if (!order) {
            console.log('[DEBUG] Order not found or does not belong to customer');
            return res.status(404).json({ 
                message: 'Order not found' 
            });
        }

        // If order is not in 'New' status, return 400
        if (order.status !== 'New') {
            console.log('[DEBUG] Order cannot be cancelled - status:', order.status);
            return res.status(400).json({ 
                message: 'Order cannot be cancelled' 
            });
        }

        // Cancel the order
        order.status = 'Cancelled';
        await order.save();
        console.log('[DEBUG] Order cancelled successfully');

        // Return success
        res.status(200).json({
            message: 'Order cancelled successfully',
            order
        });
    } catch (error) {
        console.error('[DEBUG] Error cancelling order:', error);
        res.status(500).json({ 
            message: 'Error cancelling order',
            error: error.message 
        });
    }
};

// Get order details
exports.getOrderDetails = async (req, res) => {
    try {
        const { order_id } = req.params;
        const order = await Order.findOne({
            where: { id: order_id },
            include: [
                {
                    model: Customer,
                    as: 'Customer',
                    attributes: ['name', 'email']
                },
                {
                    model: Restaurant,
                    as: 'Restaurant',
                    attributes: ['name', 'profilePicture']
                },
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [{
                        model: Dish,
                        as: 'dish',
                        attributes: ['name', 'image', 'description']
                    }]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ 
            message: 'Error fetching order details', 
            error: error.message 
        });
    }
};
