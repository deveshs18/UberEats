require('dotenv').config();
const express = require('express');
const db = require('./config/db'); // Import your db.js to establish the MySQL connection

// // Import routes
const authRoutes = require('./routes/authRoutes');
// const customerRoutes = require('./routes/customerRoutes');
// const dishRoutes = require('./routes/dishRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const restaurantRoutes = require('./routes/restaurantRoutes');

// Express app
const app = express();

// // Middleware
app.use(express.json());

// // Route Handlers
app.use('/api/auth', authRoutes);
// app.use('/api/customers', customerRoutes);
// app.use('/api/dishes', dishRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/restaurants', restaurantRoutes);

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
