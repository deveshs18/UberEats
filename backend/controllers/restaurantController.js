const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.findAll({
            attributes: [
                'id', 
                'name', 
                'description', 
                'location', 
                'contact_info', 
                'cuisine',
                'delivery_time', 
                'rating',
                'price_range',
                'profilePicture'
            ]
        });
        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error retrieving restaurants:', error);
        res.status(500).json({ 
            message: 'Error retrieving restaurants', 
            error: error.message 
        });
    }
};

// Get specific restaurant by ID
exports.getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findByPk(id, {
            attributes: [
                'id', 
                'name', 
                'description', 
                'location', 
                'contact_info', 
                'cuisine',
                'delivery_time', 
                'rating',
                'price_range',
                'profilePicture'
            ]
        });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.status(200).json(restaurant);
    } catch (error) {
        console.error('Error retrieving restaurant:', error);
        res.status(500).json({ 
            message: 'Error retrieving restaurant', 
            error: error.message 
        });
    }
};

// Get restaurant dishes (for both public and authenticated routes)
exports.getRestaurantDishes = async (req, res) => {
    try {
        // If authenticated restaurant, use their ID
        const restaurantId = req.user ? req.user.id : req.params.id;
        
        console.log('[MENU] Fetching dishes for restaurant:', restaurantId);
        
        const dishes = await Dish.findAll({
            where: { restaurant_id: restaurantId },
            attributes: [
                'id',
                'name',
                'description',
                'price',
                'category',
                'image',
                'ingredients',
                'restaurant_id'
            ]
        });

        console.log(`[MENU] Found ${dishes.length} dishes`);
        res.status(200).json(dishes);
    } catch (error) {
        console.error('[MENU] Error retrieving dishes:', error);
        res.status(500).json({ 
            message: 'Error retrieving dishes', 
            error: error.message 
        });
    }
};

// Get restaurant profile (protected)
exports.getProfile = async (req, res) => {
    try {
        const restaurantId = req.user.id;
        const restaurant = await Restaurant.findByPk(restaurantId, {
            attributes: { exclude: ['password'] }
        });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.status(200).json(restaurant);
    } catch (error) {
        console.error('Error retrieving restaurant profile:', error);
        res.status(500).json({ 
            message: 'Error retrieving restaurant profile', 
            error: error.message 
        });
    }
};

// Update restaurant profile (protected)
exports.updateProfile = async (req, res) => {
    try {
        const restaurantId = req.user.id;
        const { 
            name, 
            description, 
            location, 
            contact_info, 
            cuisine, 
            delivery_time,
            price_range,
            profilePicture 
        } = req.body;

        const restaurant = await Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Update only the provided fields
        if (name) restaurant.name = name;
        if (description) restaurant.description = description;
        if (location) restaurant.location = location;
        if (contact_info) restaurant.contact_info = contact_info;
        if (cuisine) restaurant.cuisine = cuisine;
        if (delivery_time) restaurant.delivery_time = delivery_time;
        if (price_range) restaurant.price_range = price_range;
        if (profilePicture) restaurant.profilePicture = profilePicture;

        await restaurant.save();

        // Return the complete restaurant object
        const updatedRestaurant = await Restaurant.findByPk(restaurantId, {
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({ 
            message: 'Restaurant profile updated successfully',
            restaurant: updatedRestaurant
        });
    } catch (error) {
        console.error('Error updating restaurant profile:', error);
        res.status(500).json({ 
            message: 'Error updating restaurant profile', 
            error: error.message 
        });
    }
};

// Update restaurant details (public)
exports.updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const { cuisine, delivery_time, rating, price_range } = req.body;

        const restaurant = await Restaurant.findByPk(id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        await restaurant.update({
            cuisine,
            delivery_time,
            rating,
            price_range
        });

        res.status(200).json({
            message: 'Restaurant updated successfully',
            restaurant: {
                id: restaurant.id,
                name: restaurant.name,
                description: restaurant.description,
                location: restaurant.location,
                contact_info: restaurant.contact_info,
                cuisine: restaurant.cuisine,
                delivery_time: restaurant.delivery_time,
                rating: restaurant.rating,
                price_range: restaurant.price_range,
                profilePicture: restaurant.profilePicture
            }
        });
    } catch (error) {
        console.error('Error updating restaurant:', error);
        res.status(500).json({ 
            message: 'Error updating restaurant', 
            error: error.message 
        });
    }
};

// Add a new dish (protected)
exports.addDish = async (req, res) => {
    try {
        const restaurantId = req.user.id;
        console.log('[MENU] Adding new dish for restaurant:', restaurantId);
        console.log('[MENU] Dish data:', req.body);
        
        const { name, description, price, category, image, ingredients } = req.body;

        const dish = await Dish.create({
            restaurant_id: restaurantId,
            name,
            description,
            price,
            category,
            image,
            ingredients
        });

        console.log('[MENU] Dish added successfully:', dish.id);
        res.status(201).json({
            message: 'Dish added successfully',
            dish
        });
    } catch (error) {
        console.error('[MENU] Error adding dish:', error);
        res.status(500).json({ 
            message: 'Error adding dish', 
            error: error.message 
        });
    }
};

// Update a dish (protected)
exports.updateDish = async (req, res) => {
    try {
        const restaurantId = req.user.id;
        const { dishId } = req.params;
        
        console.log('[MENU] Updating dish:', dishId, 'for restaurant:', restaurantId);
        console.log('[MENU] Update data:', req.body);

        const dish = await Dish.findOne({
            where: {
                id: dishId,
                restaurant_id: restaurantId
            }
        });

        if (!dish) {
            console.log('[MENU] Dish not found');
            return res.status(404).json({ message: 'Dish not found' });
        }

        const { name, description, price, category, image, ingredients } = req.body;
        await dish.update({
            name,
            description,
            price,
            category,
            image,
            ingredients
        });

        console.log('[MENU] Dish updated successfully');
        res.status(200).json({
            message: 'Dish updated successfully',
            dish
        });
    } catch (error) {
        console.error('[MENU] Error updating dish:', error);
        res.status(500).json({ 
            message: 'Error updating dish', 
            error: error.message 
        });
    }
};

// Delete a dish (protected)
exports.deleteDish = async (req, res) => {
    try {
        const restaurantId = req.user.id;
        const { dishId } = req.params;
        
        console.log('[MENU] Deleting dish:', dishId, 'for restaurant:', restaurantId);

        const dish = await Dish.findOne({
            where: {
                id: dishId,
                restaurant_id: restaurantId
            }
        });

        if (!dish) {
            console.log('[MENU] Dish not found');
            return res.status(404).json({ message: 'Dish not found' });
        }

        await dish.destroy();
        console.log('[MENU] Dish deleted successfully');
        
        res.status(200).json({
            message: 'Dish deleted successfully'
        });
    } catch (error) {
        console.error('[MENU] Error deleting dish:', error);
        res.status(500).json({ 
            message: 'Error deleting dish', 
            error: error.message 
        });
    }
};