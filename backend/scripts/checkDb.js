const Restaurant = require('../models/Restaurant');

async function checkDatabase() {
    try {
        // Get all restaurants
        const restaurants = await Restaurant.findAll();
        console.log('Restaurants in database:', restaurants.length);
        console.log('Restaurant data:', JSON.stringify(restaurants, null, 2));
    } catch (error) {
        console.error('Error checking database:', error);
    }
}

checkDatabase(); 