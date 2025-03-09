const { hashPassword, comparePassword } = require('../utils/passwordHash');
const Restaurant = require('../models/Restaurant');

// Signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password, description, location, contact_info } = req.body;

        // Check if restaurant already exists
        const existingRestaurant = await Restaurant.findOne({ where: { email } });
        if (existingRestaurant) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create restaurant
        const restaurant = await Restaurant.create({
            name,
            email,
            password: hashedPassword,
            description,
            location,
            contact_info
        });

        // Set up session
        req.session.user = {
            id: restaurant.id,
            email: restaurant.email,
            role: 'restaurant'
        };

        res.status(201).json({
            message: 'Restaurant registered successfully',
            restaurant: {
                id: restaurant.id,
                name: restaurant.name,
                email: restaurant.email,
                description: restaurant.description,
                location: restaurant.location,
                contact_info: restaurant.contact_info
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
        console.log('[AUTH] Login request received:', req.body);
        const { email, password } = req.body;

        // Find restaurant by email
        const restaurant = await Restaurant.findOne({ where: { email } });
        console.log('[AUTH] Restaurant found:', restaurant ? 'yes' : 'no');
        
        if (!restaurant) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Verify password
        const isValidPassword = await comparePassword(password, restaurant.password);
        console.log('[AUTH] Password valid:', isValidPassword ? 'yes' : 'no');
        
        if (!isValidPassword) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Set up session
        req.session.user = {
            id: restaurant.id,
            email: restaurant.email,
            name: restaurant.name,
            role: 'restaurant'
        };

        console.log('[AUTH] Session created:', req.session);

        // Save session before sending response
        req.session.save((err) => {
            if (err) {
                console.error('[AUTH] Session save error:', err);
                return res.status(500).json({ 
                    success: false,
                    message: 'Error creating session' 
                });
            }

            res.status(200).json({
                success: true,
                message: 'Login successful',
                restaurant: {
                    id: restaurant.id,
                    name: restaurant.name,
                    email: restaurant.email,
                    role: 'restaurant'
                }
            });
        });
    } catch (error) {
        console.error('[AUTH] Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error logging in',
            error: error.message 
        });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        console.log('[AUTH] Logout request received');
        req.session.destroy((err) => {
            if (err) {
                console.error('[AUTH] Logout error:', err);
                return res.status(500).json({ 
                    success: false,
                    message: 'Error logging out' 
                });
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ 
                success: true,
                message: 'Logged out successfully' 
            });
        });
    } catch (error) {
        console.error('[AUTH] Logout error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error logging out',
            error: error.message 
        });
    }
};

// Check if authenticated
exports.isAuthenticated = async (req, res) => {
    try {
        console.log('[AUTH] Checking authentication');
        console.log('[AUTH] Session:', req.session);
        
        if (!req.session.user || req.session.user.role !== 'restaurant') {
            return res.status(401).json({ 
                authenticated: false,
                message: 'Not authenticated' 
            });
        }

        const restaurant = await Restaurant.findByPk(req.session.user.id);
        if (!restaurant) {
            return res.status(401).json({ 
                authenticated: false,
                message: 'Restaurant not found' 
            });
        }

        res.status(200).json({
            authenticated: true,
            restaurant: {
                id: restaurant.id,
                name: restaurant.name,
                email: restaurant.email,
                role: 'restaurant'
            }
        });
    } catch (error) {
        console.error('[AUTH] Authentication check error:', error);
        res.status(500).json({ 
            authenticated: false,
            message: 'Error checking authentication',
            error: error.message 
        });
    }
};

