const express = require('express');
const menuController = require('../controllers/menuController');
const { authenticateToken, requireRestaurantOwner } = require('../middleware/auth');
const { validateMenuItem, validateId } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/restaurant/:restaurantId', menuController.getMenuItems);

// Protected routes - Restaurant owner only
router.get('/my/items', authenticateToken, requireRestaurantOwner, menuController.getMyMenuItems);
router.post('/my/items', authenticateToken, requireRestaurantOwner, validateMenuItem, menuController.createMenuItem);
router.put('/my/items/:id', authenticateToken, requireRestaurantOwner, validateId, menuController.updateMenuItem);
router.delete('/my/items/:id', authenticateToken, requireRestaurantOwner, validateId, menuController.deleteMenuItem);
router.patch('/my/items/:id/toggle', authenticateToken, requireRestaurantOwner, validateId, menuController.toggleMenuItemAvailability);

module.exports = router;