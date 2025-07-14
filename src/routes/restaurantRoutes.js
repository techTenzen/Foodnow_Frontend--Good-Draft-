const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const { authenticateToken, requireRestaurantOwner } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);

// Protected routes - Restaurant owner only
router.get('/my/restaurant', authenticateToken, requireRestaurantOwner, restaurantController.getMyRestaurant);
router.put('/my/restaurant', authenticateToken, requireRestaurantOwner, restaurantController.updateRestaurant);
router.patch('/my/status', authenticateToken, requireRestaurantOwner, restaurantController.updateRestaurantStatus);
router.get('/my/stats', authenticateToken, requireRestaurantOwner, restaurantController.getRestaurantStats);

module.exports = router;