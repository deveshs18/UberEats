require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./config/db');

// Import routes
const authCustomerRoutes = require('./routes/authCustomerRoutes');
const authRestaurantRoutes = require('./routes/authRestaurantRoutes');
const customerRoutes = require('./routes/customerRoutes');
const dishRoutes = require('./routes/dishRoutes');
const orderRoutes = require('./routes/orderRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');

// Express app
const app = express();

// // Middleware
app.use(bodyParser.json());

// Session
app.use(session({
    secret: 'your_secret_key', // Replace with an actual secret key
    resave: false,             // Don't save the session if unmodified
    saveUninitialized: false,  // Only save the session if it is modified
    cookie: { secure: false, httpOnly: true }  // Use `true` if using HTTPS
}));

// Route Handlers
app.use('/api/authCustomer', authCustomerRoutes);
app.use('/api/authRestaurant', authRestaurantRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api', dishRoutes);    // Follows /Restaurant/{restaurantId}/dishes
app.use('/api/orders', orderRoutes);
app.use('/api/restaurants', restaurantRoutes);

// Establish the database connection and start the server
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit if there's a connection error
    } else {
        console.log('Connected to the MySQL database');

        // Start the server after the database connection is established
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
});
