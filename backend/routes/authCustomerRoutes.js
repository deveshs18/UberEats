const express = require('express');
const router = express.Router();
const authController = require('../controllers/authCustomerController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/isAuthenticated', authController.isAuthenticated);

module.exports = router;
