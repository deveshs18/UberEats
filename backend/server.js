require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { sequelize } = require('./models');
const setupAssociations = require('./models/associations');

// Import routes
const authCustomerRoutes = require('./routes/authCustomerRoutes');
const authRestaurantRoutes = require('./routes/authRestaurantRoutes');
const customerRoutes = require('./routes/customerRoutes');
const dishRoutes = require('./routes/dishRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Express app
const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Origin', 'Accept'],
    exposedHeaders: ['set-cookie']
}));

// Session configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    name: 'sessionId',
    cookie: {
        secure: false, // set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
    },
    rolling: true // Refresh session with each request
}));

// Debug middleware for all requests
app.use((req, res, next) => {
    console.log('\n[DEBUG] Incoming Request:');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Full URL:', req.originalUrl);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Session:', req.session);
    console.log('SessionID:', req.sessionID);
    console.log('User:', req.session?.user);
    next();
});

// Mount routes
console.log('[DEBUG] Mounting routes...');

// Mount auth routes first
app.use('/api/authCustomer', authCustomerRoutes);
app.use('/api/authRestaurant', authRestaurantRoutes);
console.log('[DEBUG] Mounted auth routes');

// Mount order routes
app.use('/api/orders', orderRoutes);
console.log('[DEBUG] Mounted order routes at /api/orders');

// Mount other routes
app.use('/api/customers', customerRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/restaurants', restaurantRoutes);

console.log('[DEBUG] All routes mounted successfully');

// Debug middleware for unmatched routes
app.use((req, res, next) => {
    console.log('\n[DEBUG] Route not matched in server:');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Full URL:', req.originalUrl);
    console.log('Available Routes:', app._router.stack
        .filter(r => r.route || (r.name === 'router' && r.handle.stack))
        .map(r => {
            if (r.route) {
                return {
                    path: r.route.path,
                    methods: Object.keys(r.route.methods),
                    type: 'route'
                };
            }
            if (r.name === 'router') {
                return {
                    path: r.regexp.toString(),
                    routes: r.handle.stack
                        .filter(s => s.route)
                        .map(s => ({
                            path: s.route.path,
                            methods: Object.keys(s.route.methods)
                        })),
                    type: 'router'
                };
            }
        }));
    next();
});

// 404 handler
app.use((req, res) => {
    console.log('\n[DEBUG] Route not found:');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Full URL:', req.originalUrl);
    console.log('Available Routes:', app._router.stack
        .filter(r => r.route)
        .map(r => ({
            path: r.route.path,
            methods: Object.keys(r.route.methods)
        })));
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('\n[ERROR] Server Error:', err);
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Session:', req.session);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Setup model associations
setupAssociations();

// Initialize server
async function startServer() {
    try {
        // Kill any existing process on port 5000
        const PORT = process.env.PORT || 5000;
        
        // Test Sequelize connection and sync models
        await sequelize.authenticate();
        console.log('Database connection established');
        
        // Force sync all models
        await sequelize.sync({ alter: true });
        console.log('Models synchronized with alter option');

        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

// Start the server
startServer();

module.exports = app;

