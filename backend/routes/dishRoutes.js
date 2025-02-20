const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');

router.get('/restaurants/:restaurantId/dishes', dishController.getDishesByRestaurant);
router.get('/restaurants/:restaurantId/dishes/:dishId', dishController.getDishDetails);
router.post('/restaurants/:restaurantId/dishes', dishController.addDish);
router.put('/restaurants/:restaurantId/dishes/:dishId', dishController.updateDish);
router.delete('/restaurants/:restaurantId/dishes/:dishId', dishController.deleteDish);

module.exports = router;
