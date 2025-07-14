const prisma = require('../config/database');
const { generateOrderNumber } = require('../utils/orderNumber');

class OrderService {
  async createOrder(customerId, orderData) {
    const {
      restaurantId,
      deliveryAddressId,
      items,
      paymentMethod,
      specialInstructions
    } = orderData;

    // Verify restaurant exists and is accepting orders
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });

    if (!restaurant || restaurant.status !== 'APPROVED' || !restaurant.acceptingOrders) {
      throw new Error('Restaurant is not accepting orders');
    }

    // Verify delivery address belongs to customer
    const address = await prisma.address.findFirst({
      where: { id: deliveryAddressId, userId: customerId }
    });

    if (!address) {
      throw new Error('Invalid delivery address');
    }

    // Verify menu items and calculate totals
    const menuItemIds = items.map(item => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        restaurantId,
        isAvailable: true
      }
    });

    if (menuItems.length !== items.length) {
      throw new Error('Some menu items are not available');
    }

    // Calculate totals
    let totalAmount = 0;
    const orderItems = items.map(item => {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
      const subtotal = menuItem.price * item.quantity;
      totalAmount += subtotal;

      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
        subtotal
      };
    });

    const deliveryFee = 40;
    const taxAmount = Math.round(totalAmount * 0.05);
    const grandTotal = totalAmount + deliveryFee + taxAmount;

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerId,
          restaurantId,
          deliveryAddressId,
          totalAmount,
          deliveryFee,
          taxAmount,
          grandTotal,
          paymentMethod,
          specialInstructions,
          estimatedDeliveryTime: restaurant.deliveryTime,
          orderItems: {
            create: orderItems
          }
        },
        include: {
          orderItems: {
            include: {
              menuItem: true
            }
          },
          restaurant: {
            select: {
              name: true,
              phone: true
            }
          },
          deliveryAddress: true
        }
      });

      return newOrder;
    });

    return order;
  }

  async getCustomerOrders(customerId, filters) {
    const { page, limit, status } = filters;
    const skip = (page - 1) * limit;

    const where = { customerId };
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          restaurant: {
            select: {
              name: true,
              image: true
            }
          },
          orderItems: {
            include: {
              menuItem: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getRestaurantOrders(restaurantId, filters) {
    const { page, limit, status } = filters;
    const skip = (page - 1) * limit;

    const where = { restaurantId };
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: {
            select: {
              firstName: true,
              lastName: true,
              phone: true
            }
          },
          deliveryAddress: true,
          orderItems: {
            include: {
              menuItem: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getOrderById(orderId, userId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        restaurant: {
          select: {
            name: true,
            phone: true,
            address: true
          }
        },
        customer: {
          select: {
            firstName: true,
            lastName: true,
            phone: true
          }
        },
        deliveryAddress: true,
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Check if user has access to this order
    if (order.customerId !== userId && userId !== 'admin') {
      // Check if user is restaurant owner
      const restaurant = await prisma.restaurant.findFirst({
        where: { id: order.restaurantId, ownerId: userId }
      });

      if (!restaurant) {
        throw new Error('Access denied');
      }
    }

    return order;
  }

  async updateOrderStatus(orderId, restaurantId, status, estimatedDeliveryTime) {
    // Verify order belongs to restaurant
    const existingOrder = await prisma.order.findFirst({
      where: { id: orderId, restaurantId }
    });

    if (!existingOrder) {
      throw new Error('Order not found');
    }

    const updateData = { status };
    if (estimatedDeliveryTime) {
      updateData.estimatedDeliveryTime = estimatedDeliveryTime;
    }

    if (status === 'DELIVERED') {
      updateData.actualDeliveryTime = new Date();
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            phone: true
          }
        },
        restaurant: {
          select: {
            name: true
          }
        }
      }
    });

    return order;
  }

  async cancelOrder(orderId, customerId) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, customerId }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (!['PLACED', 'CONFIRMED'].includes(order.status)) {
      throw new Error('Order cannot be cancelled at this stage');
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' }
    });

    return updatedOrder;
  }
}

module.exports = new OrderService();