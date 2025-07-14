const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateId } = require('../middleware/validation');

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(requireRole('ADMIN'));

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

// Restaurant management
router.get('/restaurants/pending', adminController.getPendingRestaurants);
router.patch('/restaurants/:id/approve', validateId, adminController.approveRestaurant);
router.patch('/restaurants/:id/reject', validateId, adminController.rejectRestaurant);

// User management
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/toggle-status', validateId, adminController.toggleUserStatus);

// Feedback management
router.get('/feedback', adminController.getAllFeedback);
router.patch('/feedback/:id/status', validateId, adminController.updateFeedbackStatus);

module.exports = router;