const menuService = require('../services/menuService');

class MenuController {
  async getMenuItems(req, res, next) {
    try {
      const { restaurantId } = req.params;
      const { category, available } = req.query;
      const result = await menuService.getMenuItems(restaurantId, { category, available });
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyMenuItems(req, res, next) {
    try {
      const { category, available } = req.query;
      const result = await menuService.getMenuItems(req.restaurant.id, { category, available });
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async createMenuItem(req, res, next) {
    try {
      const result = await menuService.createMenuItem(req.restaurant.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Menu item created successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMenuItem(req, res, next) {
    try {
      const { id } = req.params;
      const result = await menuService.updateMenuItem(id, req.restaurant.id, req.body);
      res.json({
        success: true,
        message: 'Menu item updated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMenuItem(req, res, next) {
    try {
      const { id } = req.params;
      await menuService.deleteMenuItem(id, req.restaurant.id);
      res.json({
        success: true,
        message: 'Menu item deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleMenuItemAvailability(req, res, next) {
    try {
      const { id } = req.params;
      const result = await menuService.toggleMenuItemAvailability(id, req.restaurant.id);
      res.json({
        success: true,
        message: 'Menu item availability updated',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MenuController();