const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

const requireRestaurantOwner = async (req, res, next) => {
  try {
    if (req.user.role !== 'RESTAURANT_OWNER') {
      return res.status(403).json({
        success: false,
        message: 'Restaurant owner access required'
      });
    }

    // Get restaurant for this owner
    const restaurant = await prisma.restaurant.findUnique({
      where: { ownerId: req.user.id }
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    if (restaurant.status !== 'APPROVED') {
      return res.status(403).json({
        success: false,
        message: 'Restaurant not approved yet'
      });
    }

    req.restaurant = restaurant;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireRestaurantOwner
};