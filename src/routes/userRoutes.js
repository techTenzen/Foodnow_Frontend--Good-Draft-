const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateAddress, validateId } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Address management
router.get('/addresses', userController.getAddresses);
router.post('/addresses', validateAddress, userController.createAddress);
router.put('/addresses/:id', validateId, validateAddress, userController.updateAddress);
router.delete('/addresses/:id', validateId, userController.deleteAddress);
router.patch('/addresses/:id/default', validateId, userController.setDefaultAddress);

module.exports = router;