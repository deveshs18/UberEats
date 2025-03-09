const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticateCustomer } = require('../middleware/auth');

// Profile routes
router.get('/profile', authenticateCustomer, customerController.getProfile);
router.put('/profile', authenticateCustomer, customerController.updateProfile);

// Favorite routes
router.get('/favorites', authenticateCustomer, customerController.getFavorites);
router.post('/favorites/:restaurantId', authenticateCustomer, customerController.addFavorite);
router.delete('/favorites/:restaurantId', authenticateCustomer, customerController.removeFavorite);

module.exports = router;
