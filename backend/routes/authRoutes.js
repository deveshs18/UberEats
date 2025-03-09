const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Check authentication status
router.get('/check-auth', authController.checkAuth);

module.exports = router; 