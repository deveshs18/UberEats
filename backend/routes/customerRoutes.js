const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/profile', customerController.getProfile);
router.put('/profile', customerController.updateProfile);
router.get('/favorites', customerController.getFavorites);
router.post('/favorites/:restaurantId', customerController.addFavorite);
router.delete('/favorites/:restaurantId', customerController.removeFavorite);

module.exports = router;
