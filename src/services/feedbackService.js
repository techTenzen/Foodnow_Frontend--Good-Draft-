const prisma = require('../config/database');

class FeedbackService {
  async createFeedback(customerId, feedbackData) {
    const { type, title, message, rating, restaurantId, orderId } = feedbackData;

    // If orderId is provided, verify it belongs to the customer
    if (orderId) {
      const order = await prisma.order.findFirst({
        where: { id: orderId, customerId }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // Check if feedback already exists for this order
      const existingFeedback = await prisma.feedback.findUnique({
        where: { orderId }
      });

      if (existingFeedback) {
        throw new Error('Feedback already submitted for this order');
      }
    }

    const feedback = await prisma.feedback.create({
      data: {
        type,
        title,
        message,
        rating,
        customerId,
        restaurantId,
        orderId,
        priority: type === 'COMPLAINT' ? 'HIGH' : 'LOW'
      },
      include: {
        restaurant: {
          select: {
            name: true
          }
        },
        order: {
          select: {
            orderNumber: true
          }
        }
      }
    });

    // If this is a review with rating, update restaurant rating
    if (type === 'REVIEW' && rating && restaurantId) {
      await this.updateRestaurantRating(restaurantId);
    }

    return feedback;
  }

  async getUserFeedback(customerId, filters) {
    const { page, limit, type } = filters;
    const skip = (page - 1) * limit;

    const where = { customerId };
    if (type) {
      where.type = type;
    }

    const [feedback, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        skip,
        take: limit,
        include: {
          restaurant: {
            select: {
              name: true
            }
          },
          order: {
            select: {
              orderNumber: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.feedback.count({ where })
    ]);

    return {
      feedback,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getRestaurantFeedback(restaurantId, filters) {
    const { page, limit, type } = filters;
    const skip = (page - 1) * limit;

    const where = { restaurantId };
    if (type) {
      where.type = type;
    }

    const [feedback, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          order: {
            select: {
              orderNumber: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.feedback.count({ where })
    ]);

    return {
      feedback,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateRestaurantRating(restaurantId) {
    const reviews = await prisma.feedback.findMany({
      where: {
        restaurantId,
        type: 'REVIEW',
        rating: { not: null }
      },
      select: { rating: true }
    });

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = totalRating / reviews.length;

      await prisma.restaurant.update({
        where: { id: restaurantId },
        data: {
          rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
          totalRatings: reviews.length
        }
      });
    }
  }
}

module.exports = new FeedbackService();