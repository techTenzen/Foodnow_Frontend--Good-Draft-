const prisma = require('../config/database');

class MenuService {
  async getMenuItems(restaurantId, filters = {}) {
    const { category, available } = filters;

    const where = { restaurantId };

    if (category) {
      where.category = category;
    }

    if (available !== undefined) {
      where.isAvailable = available === 'true';
    }

    const menuItems = await prisma.menuItem.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });

    // Group by category
    const groupedItems = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    return {
      items: menuItems,
      groupedItems
    };
  }

  async createMenuItem(restaurantId, itemData) {
    const {
      name,
      description,
      price,
      image,
      category,
      isVegetarian = false
    } = itemData;

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        isVegetarian,
        restaurantId
      }
    });

    return menuItem;
  }

  async updateMenuItem(itemId, restaurantId, updateData) {
    const {
      name,
      description,
      price,
      image,
      category,
      isVegetarian,
      isAvailable
    } = updateData;

    // Verify item belongs to restaurant
    const existingItem = await prisma.menuItem.findFirst({
      where: { id: itemId, restaurantId }
    });

    if (!existingItem) {
      throw new Error('Menu item not found');
    }

    const menuItem = await prisma.menuItem.update({
      where: { id: itemId },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        image,
        category,
        isVegetarian,
        isAvailable
      }
    });

    return menuItem;
  }

  async deleteMenuItem(itemId, restaurantId) {
    // Verify item belongs to restaurant
    const existingItem = await prisma.menuItem.findFirst({
      where: { id: itemId, restaurantId }
    });

    if (!existingItem) {
      throw new Error('Menu item not found');
    }

    await prisma.menuItem.delete({
      where: { id: itemId }
    });
  }

  async toggleMenuItemAvailability(itemId, restaurantId) {
    // Verify item belongs to restaurant
    const existingItem = await prisma.menuItem.findFirst({
      where: { id: itemId, restaurantId }
    });

    if (!existingItem) {
      throw new Error('Menu item not found');
    }

    const menuItem = await prisma.menuItem.update({
      where: { id: itemId },
      data: {
        isAvailable: !existingItem.isAvailable
      }
    });

    return menuItem;
  }
}

module.exports = new MenuService();