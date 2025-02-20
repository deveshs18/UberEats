const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.placeOrder);
router.get('/:orderId', orderController.getOrderDetails);
router.get('/', orderController.getAllOrdersForUser);
router.put('/:orderId/status', orderController.updateOrderStatus);  // (restaurant user only)
router.delete('/:orderId', orderController.cancelOrder);    // (customer user only)

module.exports = router;
