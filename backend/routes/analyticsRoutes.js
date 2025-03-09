const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { authenticateRestaurant } = require('../middleware/auth');

// Get restaurant analytics
router.get('/', authenticateRestaurant, getAnalytics);

module.exports = router; 