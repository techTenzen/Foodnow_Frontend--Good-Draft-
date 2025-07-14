const orderService = require('../services/orderService');

class OrderController {
  async createOrder(req, res, next) {
    try {
      const result = await orderService.createOrder(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyOrders(req, res, next) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const result = await orderService.getCustomerOrders(req.user.id, {
        page: parseInt(page),
        limit: parseInt(limit),
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

  async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await orderService.getOrderById(id, req.user.id);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getRestaurantOrders(req, res, next) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const result = await orderService.getRestaurantOrders(req.restaurant.id, {
        page: parseInt(page),
        limit: parseInt(limit),
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

  async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, estimatedDeliveryTime } = req.body;
      const result = await orderService.updateOrderStatus(id, req.restaurant.id, status, estimatedDeliveryTime);
      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const { id } = req.params;
      const result = await orderService.cancelOrder(id, req.user.id);
      res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();