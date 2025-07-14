const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const { authenticateToken, requireRole, requireRestaurantOwner } = require('../middleware/auth');
const { validateFeedback } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Customer routes
router.post('/', requireRole('CUSTOMER'), validateFeedback, feedbackController.createFeedback);
router.get('/my/feedback', requireRole('CUSTOMER'), feedbackController.getMyFeedback);

// Restaurant routes
router.get('/restaurant/feedback', requireRestaurantOwner, feedbackController.getRestaurantFeedback);

module.exports = router;