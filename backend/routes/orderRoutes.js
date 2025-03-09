const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateCustomer, authenticateRestaurant } = require('../middleware/auth');

// Debug middleware for order routes
router.use((req, res, next) => {
    console.log('\n[DEBUG] Order Router:');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Full URL:', req.originalUrl);
    console.log('Params:', req.params);
    console.log('Query:', req.query);
    console.log('Session:', req.session);
    console.log('User:', req.session?.user);
    next();
});

// Authentication middleware for all routes
router.use((req, res, next) => {
    if (!req.session || !req.session.user) {
        console.log('[DEBUG] No session or user found');
        return res.status(401).json({ message: 'Please login to continue' });
    }
    next();
});

// Parameter validation middleware
router.param('order_id', (req, res, next, orderId) => {
    console.log('[DEBUG] Validating order_id:', orderId);
    if (!orderId || isNaN(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }
    req.orderId = parseInt(orderId);
    next();
});

// Fixed path routes (place these first)
router.get('/customer', authenticateCustomer, orderController.getCustomerOrders);
router.get('/restaurant', authenticateRestaurant, orderController.getRestaurantOrders);
router.post('/', authenticateCustomer, orderController.createOrder);

// Routes with multiple path segments
router.put('/:order_id/status', authenticateRestaurant, orderController.updateOrderStatus);

// Single parameter routes (place these last)
router.route('/:order_id')
    .get(authenticateCustomer, orderController.getOrderDetails)
    .delete(authenticateCustomer, orderController.cancelOrder);

// Debug middleware for unmatched routes
router.use((req, res, next) => {
    console.log('\n[DEBUG] Order Route not matched:');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Full URL:', req.originalUrl);
    console.log('Available Routes:', router.stack
        .filter(r => r.route)
        .map(r => ({
            path: r.route.path,
            methods: Object.keys(r.route.methods),
            pattern: r.route.path.replace(/:[^/]+/g, '*')
        })));
    next();
});

module.exports = router;
