const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.get('/profile', restaurantController.getProfile);
router.put('/profile', restaurantController.updateProfile);
// router.post('/dishes', restaurantController.addOrUpdateDish);
// router.get('/dishes', restaurantController.getDishes);

module.exports = router;
