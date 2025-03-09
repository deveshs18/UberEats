const Customer = require('../models/Customer');
const Restaurant = require('../models/Restaurant');

const authenticateCustomer = async (req, res, next) => {
    try {
        console.log('\n[AUTH] Customer Authentication:');
        console.log('Path:', req.path);
        console.log('Method:', req.method);
        console.log('Session:', req.session);
        console.log('User:', req.session?.user);
        
        if (!req.session.user || req.session.user.role !== 'customer') {
            console.log('[AUTH] Authentication failed: Invalid session or role');
            console.log('Session user:', req.session?.user);
            console.log('User role:', req.session?.user?.role);
            return res.status(401).json({ message: 'Please login as customer' });
        }

        const customer = await Customer.findByPk(req.session.user.id);
        console.log('[AUTH] Customer lookup result:', customer ? 'Found' : 'Not found');
        
        if (!customer) {
            console.log('[AUTH] Authentication failed: Customer not found');
            return res.status(401).json({ message: 'Customer not found' });
        }

        console.log('[AUTH] Authentication successful for customer:', customer.id);
        req.user = customer;
        next();
    } catch (error) {
        console.error('[AUTH] Error:', error);
        res.status(401).json({ 
            message: 'Authentication failed',
            error: error.message 
        });
    }
};

const authenticateRestaurant = async (req, res, next) => {
    try {
        console.log('\n[AUTH] Restaurant Authentication:');
        console.log('Path:', req.path);
        console.log('Method:', req.method);
        console.log('Session:', req.session);
        console.log('User:', req.session?.user);

        if (!req.session.user || req.session.user.role !== 'restaurant') {
            console.log('[AUTH] Authentication failed: Invalid session or role');
            console.log('Session user:', req.session?.user);
            console.log('User role:', req.session?.user?.role);
            return res.status(401).json({ message: 'Please login as restaurant' });
        }

        const restaurant = await Restaurant.findByPk(req.session.user.id);
        console.log('[AUTH] Restaurant lookup result:', restaurant ? 'Found' : 'Not found');

        if (!restaurant) {
            console.log('[AUTH] Authentication failed: Restaurant not found');
            return res.status(401).json({ message: 'Restaurant not found' });
        }

        console.log('[AUTH] Authentication successful for restaurant:', restaurant.id);
        req.user = restaurant;
        next();
    } catch (error) {
        console.error('[AUTH] Error:', error);
        res.status(401).json({ 
            message: 'Authentication failed',
            error: error.message 
        });
    }
};

module.exports = {
    authenticateCustomer,
    authenticateRestaurant
}; 