const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Auth validations
const validateRegister = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  handleValidationErrors
];

// Restaurant validations
const validateRestaurantRegistration = [
  body('restaurantName').trim().isLength({ min: 1 }).withMessage('Restaurant name required'),
  body('ownerName').trim().isLength({ min: 1 }).withMessage('Owner name required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').isMobilePhone().withMessage('Valid phone number required'),
  body('cuisineType').trim().isLength({ min: 1 }).withMessage('Cuisine type required'),
  body('address').trim().isLength({ min: 1 }).withMessage('Address required'),
  body('city').trim().isLength({ min: 1 }).withMessage('City required'),
  body('state').trim().isLength({ min: 1 }).withMessage('State required'),
  body('pincode').isLength({ min: 6, max: 6 }).withMessage('Valid pincode required'),
  handleValidationErrors
];

// Menu item validations
const validateMenuItem = [
  body('name').trim().isLength({ min: 1 }).withMessage('Item name required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category required'),
  body('isVegetarian').optional().isBoolean().withMessage('Vegetarian flag must be boolean'),
  handleValidationErrors
];

// Order validations
const validateOrder = [
  body('restaurantId').isString().notEmpty().withMessage('Restaurant ID required'),
  body('deliveryAddressId').isString().notEmpty().withMessage('Delivery address required'),
  body('items').isArray({ min: 1 }).withMessage('Order items required'),
  body('items.*.menuItemId').isString().notEmpty().withMessage('Menu item ID required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Valid quantity required'),
  body('paymentMethod').isIn(['CARD', 'UPI', 'COD']).withMessage('Valid payment method required'),
  handleValidationErrors
];

// Address validations
const validateAddress = [
  body('type').isIn(['HOME', 'WORK', 'OTHER']).withMessage('Valid address type required'),
  body('address').trim().isLength({ min: 1 }).withMessage('Address required'),
  body('city').trim().isLength({ min: 1 }).withMessage('City required'),
  body('state').trim().isLength({ min: 1 }).withMessage('State required'),
  body('pincode').isLength({ min: 6, max: 6 }).withMessage('Valid pincode required'),
  handleValidationErrors
];

// Feedback validations
const validateFeedback = [
  body('type').isIn(['REVIEW', 'COMPLAINT']).withMessage('Valid feedback type required'),
  body('title').trim().isLength({ min: 1 }).withMessage('Title required'),
  body('message').trim().isLength({ min: 1 }).withMessage('Message required'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  handleValidationErrors
];

// Parameter validations
const validateId = [
  param('id').isString().notEmpty().withMessage('Valid ID required'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateRestaurantRegistration,
  validateMenuItem,
  validateOrder,
  validateAddress,
  validateFeedback,
  validateId,
  handleValidationErrors
};