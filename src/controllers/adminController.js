const adminService = require('../services/adminService');

class AdminController {
  async getDashboardStats(req, res, next) {
    try {
      const result = await adminService.getDashboardStats();
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getPendingRestaurants(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await adminService.getPendingRestaurants({
        page: parseInt(page),
        limit: parseInt(limit)
      });
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async approveRestaurant(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminService.approveRestaurant(id);
      res.json({
        success: true,
        message: 'Restaurant approved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async rejectRestaurant(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const result = await adminService.rejectRestaurant(id, reason);
      res.json({
        success: true,
        message: 'Restaurant rejected',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, role, search } = req.query;
      const result = await adminService.getAllUsers({
        page: parseInt(page),
        limit: parseInt(limit),
        role,
        search
      });
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminService.toggleUserStatus(id);
      res.json({
        success: true,
        message: 'User status updated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllFeedback(req, res, next) {
    try {
      const { page = 1, limit = 10, type, status } = req.query;
      const result = await adminService.getAllFeedback({
        page: parseInt(page),
        limit: parseInt(limit),
        type,
        status
      });
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async updateFeedbackStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await adminService.updateFeedbackStatus(id, status);
      res.json({
        success: true,
        message: 'Feedback status updated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();