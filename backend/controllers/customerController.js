const Customer = require('../models/Customer');
const Favorite = require('../models/Favorite');
const Restaurant = require('../models/Restaurant');

// Get customer profile
exports.getProfile = async (req, res) => {
    try {
        const customerId = req.user.id;
        const customer = await Customer.findByPk(customerId, {
            attributes: { exclude: ['password'] }
        });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

// Update customer profile
exports.updateProfile = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { name, email, country, state } = req.body;

        const customer = await Customer.findByPk(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Update only provided fields
        if (name) customer.name = name;
        if (email) customer.email = email;
        if (country) customer.country = country;
        if (state) customer.state = state;

        await customer.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            customer: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                country: customer.country,
                state: customer.state
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

// Get user's favorite restaurants
exports.getFavorites = async (req, res) => {
    try {
        const customerId = req.user.id;
        
        const favorites = await Favorite.findAll({
            where: { customer_id: customerId },
            attributes: ['restaurant_id']
        });

        res.json(favorites);
    } catch (error) {
        console.error('Error getting favorites:', error);
        res.status(500).json({ message: 'Error retrieving favorites', error: error.message });
    }
};

// Add a restaurant to favorites
exports.addFavorite = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { restaurantId } = req.params;

        // Check if restaurant exists
        const restaurant = await Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Prevent duplicate entries
        const existingFavorite = await Favorite.findOne({ 
            where: { 
                customer_id: customerId, 
                restaurant_id: restaurantId 
            } 
        });
        
        if (existingFavorite) {
            return res.status(400).json({ message: "Restaurant already in favorites" });
        }

        // Add favorite restaurant
        await Favorite.create({ 
            customer_id: customerId, 
            restaurant_id: restaurantId 
        });

        res.status(201).json({ 
            success: true,
            message: 'Restaurant added to favorites' 
        });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ message: 'Error adding favorite', error: error.message });
    }
};

// Remove a restaurant from favorites
exports.removeFavorite = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { restaurantId } = req.params;

        const favorite = await Favorite.findOne({
            where: { 
                customer_id: customerId, 
                restaurant_id: restaurantId 
            }
        });

        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        await favorite.destroy();
        res.status(200).json({ 
            success: true,
            message: 'Restaurant removed from favorites' 
        });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ message: 'Error removing favorite', error: error.message });
    }
};
