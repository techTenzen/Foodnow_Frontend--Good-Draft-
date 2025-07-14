const prisma = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

class AuthService {
  async registerCustomer(userData) {
    const { email, password, firstName, lastName, phone } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: 'CUSTOMER',
        avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=FF6B00&color=fff`
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true
      }
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return { user, token };
  }

  async registerRestaurant(restaurantData) {
    const {
      restaurantName,
      ownerName,
      email,
      password,
      phone,
      cuisineType,
      address,
      city,
      state,
      pincode,
      establishmentDate,
      priceForTwo = 400
    } = restaurantData;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user and restaurant in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create owner user
      const owner = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName: ownerName.split(' ')[0],
          lastName: ownerName.split(' ').slice(1).join(' ') || '',
          phone,
          role: 'RESTAURANT_OWNER',
          avatar: `https://ui-avatars.com/api/?name=${ownerName}&background=FF6B00&color=fff`
        }
      });

      // Create restaurant
      const restaurant = await tx.restaurant.create({
        data: {
          name: restaurantName,
          description: `Delicious ${cuisineType} cuisine`,
          cuisineType,
          address,
          city,
          state,
          pincode,
          phone,
          email,
          priceForTwo,
          establishmentDate: new Date(establishmentDate),
          ownerId: owner.id,
          status: 'PENDING'
        }
      });

      return { owner, restaurant };
    });

    return {
      message: 'Restaurant registration submitted for approval',
      restaurantId: result.restaurant.id
    };
  }

  async login(email, password) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        restaurant: true
      }
    });

    if (!user || !user.isActive) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // For restaurant owners, check if restaurant is approved
    if (user.role === 'RESTAURANT_OWNER') {
      if (!user.restaurant || user.restaurant.status !== 'APPROVED') {
        throw new Error('Restaurant not approved yet');
      }
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async adminLogin(email, password) {
    // Hardcoded admin credentials
    if (email !== 'admin@foodnow.com' || password !== 'admin123') {
      throw new Error('Invalid admin credentials');
    }

    // Generate token for admin
    const token = generateToken({
      userId: 'admin',
      email: 'admin@foodnow.com',
      role: 'ADMIN'
    });

    const adminUser = {
      id: 'admin',
      email: 'admin@foodnow.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=0F1C2E&color=fff'
    };

    return { user: adminUser, token };
  }

  async getProfile(userId) {
    if (userId === 'admin') {
      return {
        id: 'admin',
        email: 'admin@foodnow.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=0F1C2E&color=fff'
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateProfile(userId, updateData) {
    const { firstName, lastName, phone } = updateData;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone,
        avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=FF6B00&color=fff`
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
        updatedAt: true
      }
    });

    return user;
  }
}

module.exports = new AuthService();