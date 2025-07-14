const express = require('express');
const orderController = require('../controllers/orderController');
const { authenticateToken, requireRole, requireRestaurantOwner } = require('../middleware/auth');
const { validateOrder, validateId } = require('../middleware/validation');

const router = express.Router();

// Customer routes
router.post('/', authenticateToken, requireRole('CUSTOMER'), validateOrder, orderController.createOrder);
router.get('/my/orders', authenticateToken, requireRole('CUSTOMER'), orderController.getMyOrders);
router.get('/:id', authenticateToken, validateId, orderController.getOrderById);
router.patch('/:id/cancel', authenticateToken, requireRole('CUSTOMER'), validateId, orderController.cancelOrder);

// Restaurant routes
router.get('/restaurant/orders', authenticateToken, requireRestaurantOwner, orderController.getRestaurantOrders);
router.patch('/:id/status', authenticateToken, requireRestaurantOwner, validateId, orderController.updateOrderStatus);

module.exports = router;