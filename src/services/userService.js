const prisma = require('../config/database');

class UserService {
  async getUserAddresses(userId) {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return addresses;
  }

  async createAddress(userId, addressData) {
    const { type, address, landmark, city, state, pincode, isDefault } = addressData;

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        type,
        address,
        landmark,
        city,
        state,
        pincode,
        isDefault: isDefault || false
      }
    });

    return newAddress;
  }

  async updateAddress(addressId, userId, updateData) {
    // Verify address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId }
    });

    if (!existingAddress) {
      throw new Error('Address not found');
    }

    const { type, address, landmark, city, state, pincode, isDefault } = updateData;

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: addressId } },
        data: { isDefault: false }
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        type,
        address,
        landmark,
        city,
        state,
        pincode,
        isDefault
      }
    });

    return updatedAddress;
  }

  async deleteAddress(addressId, userId) {
    // Verify address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId }
    });

    if (!existingAddress) {
      throw new Error('Address not found');
    }

    await prisma.address.delete({
      where: { id: addressId }
    });
  }

  async setDefaultAddress(addressId, userId) {
    // Verify address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId }
    });

    if (!existingAddress) {
      throw new Error('Address not found');
    }

    // Unset other default addresses
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false }
    });

    // Set this address as default
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true }
    });

    return updatedAddress;
  }
}

module.exports = new UserService();