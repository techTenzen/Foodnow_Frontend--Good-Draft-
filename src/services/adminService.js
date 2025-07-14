const prisma = require('../config/database');

class AdminService {
  async getDashboardStats() {
    const [
      totalUsers,
      totalRestaurants,
      pendingRestaurants,
      totalOrders,
      todayOrders,
      totalRevenue
    ] = await Promise.all([
      prisma.user.count(),
      prisma.restaurant.count({ where: { status: 'APPROVED' } }),
      prisma.restaurant.count({ where: { status: 'PENDING' } }),
      prisma.order.count(),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.order.aggregate({
        where: { status: { not: 'CANCELLED' } },
        _sum: { grandTotal: true }
      })
    ]);

    return {
      totalUsers,
      totalRestaurants,
      pendingRestaurants,
      totalOrders,
      todayOrders,
      totalRevenue: totalRevenue._sum.grandTotal || 0
    };
  }

  async getPendingRestaurants(filters) {
    const { page, limit } = filters;
    const skip = (page - 1) * limit;

    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where: { status: 'PENDING' },
        skip,
        take: limit,
        include: {
          owner: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.restaurant.count({ where: { status: 'PENDING' } })
    ]);

    return {
      restaurants,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async approveRestaurant(restaurantId) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    if (restaurant.status !== 'PENDING') {
      throw new Error('Restaurant is not pending approval');
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { status: 'APPROVED' }
    });

    return updatedRestaurant;
  }

  async rejectRestaurant(restaurantId, reason) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    if (restaurant.status !== 'PENDING') {
      throw new Error('Restaurant is not pending approval');
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { 
        status: 'REJECTED'
        // In a real app, you might store the rejection reason
      }
    });

    return updatedRestaurant;
  }

  async getAllUsers(filters) {
    const { page, limit, role, search } = filters;
    const skip = (page - 1) * limit;

    const where = {};
    if (role) {
      where.role = role;
    }
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: { orders: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async toggleUserStatus(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true
      }
    });

    return updatedUser;
  }

  async getAllFeedback(filters) {
    const { page, limit, type, status } = filters;
    const skip = (page - 1) * limit;

    const where = {};
    if (type) {
      where.type = type;
    }
    if (status) {
      where.status = status;
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
              lastName: true,
              email: true
            }
          },
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

  async updateFeedbackStatus(feedbackId, status) {
    const feedback = await prisma.feedback.update({
      where: { id: feedbackId },
      data: { status },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        restaurant: {
          select: {
            name: true
          }
        }
      }
    });

    return feedback;
  }
}

module.exports = new AdminService();