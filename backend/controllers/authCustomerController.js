const { hashPassword, comparePassword } = require('../utils/passwordHash');
const Customer = require('../models/Customer');
const bcrypt = require('bcrypt');

// Signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await Customer.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create the user in the database
        const customer = await Customer.create({ 
            name, 
            email, 
            password: hashedPassword 
        });

        // Set up session
        req.session.user = {
            id: customer.id,
            email: customer.email,
            name: customer.name,
            role: 'customer'
        };

        return res.status(201).json({ 
            message: "User registered successfully",
            user: { 
                id: customer.id, 
                email: customer.email, 
                name: customer.name 
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            message: 'Error signing up',
            error: error.message 
        });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        console.log('Login request received:', req.body);
        const { email, password } = req.body;
        
        // Find user by email
        const user = await Customer.findOne({ where: { email } });
        console.log('User found:', user ? 'yes' : 'no');
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Compare password
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isValidPassword ? 'yes' : 'no');
        
        if (!isValidPassword) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Set user session
        req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: 'customer'
        };

        // Save session before sending response
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ 
                    success: false,
                    message: 'Error creating session' 
                });
            }

            console.log('Session saved successfully');
            res.json({
                success: true,
                message: 'Login successful',
                name: user.name,
                role: 'customer'
            });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error during login',
            error: error.message 
        });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                throw new Error('Error destroying session');
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ message: 'Logged out successfully' });
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ 
            message: 'Error logging out',
            error: error.message 
        });
    }
};

// Check if user is authenticated
exports.isAuthenticated = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const user = await Customer.findByPk(req.session.user.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        res.status(200).json({
            authenticated: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Authentication check error:', error);
        res.status(401).json({ 
            message: 'Authentication failed',
            error: error.message 
        });
    }
};
