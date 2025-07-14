const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validateRestaurantRegistration
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validateRegister, authController.registerCustomer);
router.post('/restaurant/register', validateRestaurantRegistration, authController.registerRestaurant);
router.post('/login', validateLogin, authController.login);
router.post('/admin/login', validateLogin, authController.adminLogin);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);

module.exports = router;