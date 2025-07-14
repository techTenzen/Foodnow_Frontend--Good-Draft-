const userService = require('../services/userService');

class UserController {
  async getAddresses(req, res, next) {
    try {
      const result = await userService.getUserAddresses(req.user.id);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async createAddress(req, res, next) {
    try {
      const result = await userService.createAddress(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Address created successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(req, res, next) {
    try {
      const { id } = req.params;
      const result = await userService.updateAddress(id, req.user.id, req.body);
      res.json({
        success: true,
        message: 'Address updated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req, res, next) {
    try {
      const { id } = req.params;
      await userService.deleteAddress(id, req.user.id);
      res.json({
        success: true,
        message: 'Address deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async setDefaultAddress(req, res, next) {
    try {
      const { id } = req.params;
      const result = await userService.setDefaultAddress(id, req.user.id);
      res.json({
        success: true,
        message: 'Default address updated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();