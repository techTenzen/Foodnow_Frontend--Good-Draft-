const restaurantService = require('../services/restaurantService');

class RestaurantController {
  async getAllRestaurants(req, res, next) {
    try {
      const { page = 1, limit = 10, search, cuisine } = req.query;
      const result = await restaurantService.getAllRestaurants({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        cuisine
      });
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getRestaurantById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await restaurantService.getRestaurantById(id);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyRestaurant(req, res, next) {
    try {
      const result = await restaurantService.getRestaurantByOwnerId(req.user.id);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRestaurant(req, res, next) {
    try {
      const result = await restaurantService.updateRestaurant(req.restaurant.id, req.body);
      res.json({
        success: true,
        message: 'Restaurant updated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRestaurantStatus(req, res, next) {
    try {
      const { isOpen, acceptingOrders } = req.body;
      const result = await restaurantService.updateRestaurantStatus(req.restaurant.id, {
        isOpen,
        acceptingOrders
      });
      res.json({
        success: true,
        message: 'Restaurant status updated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getRestaurantStats(req, res, next) {
    try {
      const result = await restaurantService.getRestaurantStats(req.restaurant.id);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RestaurantController();