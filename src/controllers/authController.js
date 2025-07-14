const authService = require('../services/authService');

class AuthController {
  async registerCustomer(req, res, next) {
    try {
      const result = await authService.registerCustomer(req.body);
      res.status(201).json({
        success: true,
        message: 'Customer registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async registerRestaurant(req, res, next) {
    try {
      const result = await authService.registerRestaurant(req.body);
      res.status(201).json({
        success: true,
        message: 'Restaurant registration submitted for approval',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async adminLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.adminLogin(email, password);
      res.json({
        success: true,
        message: 'Admin login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const result = await authService.getProfile(req.user.id);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const result = await authService.updateProfile(req.user.id, req.body);
      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();