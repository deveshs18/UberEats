const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { authenticateRestaurant } = require('../middleware/auth');

// Protected routes (require restaurant authentication)
router.get('/profile', authenticateRestaurant, restaurantController.getProfile);
router.put('/profile', authenticateRestaurant, restaurantController.updateProfile);

// Public routes
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.put('/:id', restaurantController.updateRestaurant);

// Restaurant menu management routes
router.get('/:id/dishes', restaurantController.getRestaurantDishes);
router.post('/:id/dishes', authenticateRestaurant, restaurantController.addDish);
router.put('/:id/dishes/:dishId', authenticateRestaurant, restaurantController.updateDish);
router.delete('/:id/dishes/:dishId', authenticateRestaurant, restaurantController.deleteDish);

module.exports = router;
