const prisma = require('../config/database');

class RestaurantService {
  async getAllRestaurants(filters) {
    const { page, limit, search, cuisine } = filters;
    const skip = (page - 1) * limit;

    const where = {
      status: 'APPROVED',
      isOpen: true
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { cuisineType: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (cuisine) {
      where.cuisineType = { contains: cuisine, mode: 'insensitive' };
    }

    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        skip,
        take: limit,
        include: {
          offers: {
            where: { isActive: true }
          },
          _count: {
            select: { orders: true }
          }
        },
        orderBy: { rating: 'desc' }
      }),
      prisma.restaurant.count({ where })
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

  async getRestaurantById(id) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { 
        id,
        status: 'APPROVED'
      },
      include: {
        menuItems: {
          where: { isAvailable: true },
          orderBy: { category: 'asc' }
        },
        offers: {
          where: { isActive: true }
        }
      }
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    return restaurant;
  }

  async getRestaurantByOwnerId(ownerId) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { ownerId },
      include: {
        menuItems: {
          orderBy: { category: 'asc' }
        },
        offers: true,
        _count: {
          select: { orders: true }
        }
      }
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    return restaurant;
  }

  async updateRestaurant(restaurantId, updateData) {
    const {
      name,
      description,
      cuisineType,
      address,
      city,
      state,
      pincode,
      phone,
      priceForTwo,
      deliveryTime
    } = updateData;

    const restaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        name,
        description,
        cuisineType,
        address,
        city,
        state,
        pincode,
        phone,
        priceForTwo,
        deliveryTime
      }
    });

    return restaurant;
  }

  async updateRestaurantStatus(restaurantId, statusData) {
    const { isOpen, acceptingOrders } = statusData;

    const restaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        isOpen,
        acceptingOrders
      }
    });

    return restaurant;
  }

  async getRestaurantStats(restaurantId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      todayOrders,
      totalOrders,
      todayRevenue,
      totalRevenue,
      avgRating,
      totalMenuItems
    ] = await Promise.all([
      prisma.order.count({
        where: {
          restaurantId,
          createdAt: { gte: today }
        }
      }),
      prisma.order.count({
        where: { restaurantId }
      }),
      prisma.order.aggregate({
        where: {
          restaurantId,
          createdAt: { gte: today },
          status: { not: 'CANCELLED' }
        },
        _sum: { grandTotal: true }
      }),
      prisma.order.aggregate({
        where: {
          restaurantId,
          status: { not: 'CANCELLED' }
        },
        _sum: { grandTotal: true }
      }),
      prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { rating: true }
      }),
      prisma.menuItem.count({
        where: { restaurantId }
      })
    ]);

    return {
      todayOrders,
      totalOrders,
      todayRevenue: todayRevenue._sum.grandTotal || 0,
      totalRevenue: totalRevenue._sum.grandTotal || 0,
      avgRating: avgRating?.rating || 0,
      totalMenuItems
    };
  }
}

module.exports = new RestaurantService();