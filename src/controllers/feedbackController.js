const feedbackService = require('../services/feedbackService');

class FeedbackController {
  async createFeedback(req, res, next) {
    try {
      const result = await feedbackService.createFeedback(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyFeedback(req, res, next) {
    try {
      const { page = 1, limit = 10, type } = req.query;
      const result = await feedbackService.getUserFeedback(req.user.id, {
        page: parseInt(page),
        limit: parseInt(limit),
        type
      });
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getRestaurantFeedback(req, res, next) {
    try {
      const { page = 1, limit = 10, type } = req.query;
      const result = await feedbackService.getRestaurantFeedback(req.restaurant.id, {
        page: parseInt(page),
        limit: parseInt(limit),
        type
      });
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FeedbackController();