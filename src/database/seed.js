const prisma = require('../config/database');
const { hashPassword } = require('../utils/password');

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Create admin user (handled in auth service)
    console.log('✅ Admin user configured');

    // Create test customer
    const customerPassword = await hashPassword('123');
    const customer = await prisma.user.upsert({
      where: { email: 'customer@test.com' },
      update: {},
      create: {
        email: 'customer@test.com',
        password: customerPassword,
        firstName: 'Test',
        lastName: 'Customer',
        phone: '+91 9876543210',
        role: 'CUSTOMER',
        avatar: 'https://ui-avatars.com/api/?name=Test+Customer&background=FF6B00&color=fff'
      }
    });

    // Create test customer address
    await prisma.address.upsert({
      where: { id: 'test-address-1' },
      update: {},
      create: {
        id: 'test-address-1',
        userId: customer.id,
        type: 'HOME',
        address: '123 Main Street, Koramangala',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560034',
        isDefault: true
      }
    });

    // Create test restaurant owner
    const ownerPassword = await hashPassword('123');
    const owner = await prisma.user.upsert({
      where: { email: 'kiranas@test.com' },
      update: {},
      create: {
        email: 'kiranas@test.com',
        password: ownerPassword,
        firstName: 'Kirana',
        lastName: 'Owner',
        phone: '+91 9876543211',
        role: 'RESTAURANT_OWNER',
        avatar: 'https://ui-avatars.com/api/?name=Kirana+Owner&background=FF6B00&color=fff'
      }
    });

    // Create test restaurant
    const restaurant = await prisma.restaurant.upsert({
      where: { email: 'kiranas@test.com' },
      update: {},
      create: {
        name: 'Kiranas Restaurant',
        description: 'Authentic South Indian cuisine with traditional flavors',
        cuisineType: 'South Indian',
        address: '456 Food Street, HSR Layout',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560102',
        phone: '+91 9876543211',
        email: 'kiranas@test.com',
        image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=500',
        rating: 4.5,
        totalRatings: 124,
        priceForTwo: 400,
        deliveryTime: '25-30 mins',
        status: 'APPROVED',
        establishmentDate: new Date('2020-01-15'),
        ownerId: owner.id
      }
    });

    // Create restaurant offers
    await prisma.restaurantOffer.upsert({
      where: { id: 'offer-1' },
      update: {},
      create: {
        id: 'offer-1',
        title: '20% OFF up to ₹100',
        description: 'Valid on orders above ₹299',
        restaurantId: restaurant.id
      }
    });

    // Create menu items
    const menuItems = [
      {
        id: 'menu-1',
        name: 'Masala Dosa',
        description: 'Crispy dosa with spiced potato filling, served with sambar and chutney',
        price: 149,
        image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'South Indian',
        isVegetarian: true
      },
      {
        id: 'menu-2',
        name: 'Chicken Biryani',
        description: 'Aromatic basmati rice with tender chicken pieces and traditional spices',
        price: 299,
        image: 'https://images.pexels.com/photos/11772142/pexels-photo-11772142.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Biryani',
        isVegetarian: false
      },
      {
        id: 'menu-3',
        name: 'Idli Sambar',
        description: 'Soft steamed rice cakes served with sambar and coconut chutney',
        price: 99,
        image: 'https://images.pexels.com/photos/6260921/pexels-photo-6260921.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'South Indian',
        isVegetarian: true
      },
      {
        id: 'menu-4',
        name: 'Mutton Biryani',
        description: 'Rich and flavorful biryani with tender mutton pieces',
        price: 399,
        image: 'https://images.pexels.com/photos/11772142/pexels-photo-11772142.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Biryani',
        isVegetarian: false
      },
      {
        id: 'menu-5',
        name: 'Filter Coffee',
        description: 'Traditional South Indian filter coffee',
        price: 49,
        image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Beverages',
        isVegetarian: true
      },
      {
        id: 'menu-6',
        name: 'Rava Upma',
        description: 'Semolina cooked with vegetables and spices',
        price: 79,
        image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'South Indian',
        isVegetarian: true
      }
    ];

    for (const item of menuItems) {
      await prisma.menuItem.upsert({
        where: { id: item.id },
        update: {},
        create: {
          ...item,
          restaurantId: restaurant.id
        }
      });
    }

    // Create sample order
    const order = await prisma.order.create({
      data: {
        orderNumber: 'FN001001',
        customerId: customer.id,
        restaurantId: restaurant.id,
        deliveryAddressId: 'test-address-1',
        totalAmount: 448,
        deliveryFee: 40,
        taxAmount: 22,
        grandTotal: 510,
        paymentMethod: 'UPI',
        status: 'DELIVERED',
        estimatedDeliveryTime: '25-30 mins',
        actualDeliveryTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        orderItems: {
          create: [
            {
              menuItemId: 'menu-2', // Chicken Biryani
              quantity: 1,
              price: 299,
              subtotal: 299
            },
            {
              menuItemId: 'menu-1', // Masala Dosa
              quantity: 1,
              price: 149,
              subtotal: 149
            }
          ]
        }
      }
    });

    // Create sample feedback
    await prisma.feedback.create({
      data: {
        type: 'REVIEW',
        title: 'Excellent food quality!',
        message: 'The biryani was absolutely delicious and arrived hot. Great packaging too. Will definitely order again!',
        rating: 5,
        customerId: customer.id,
        restaurantId: restaurant.id,
        orderId: order.id,
        status: 'RESOLVED'
      }
    });

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('👤 Customer: customer@test.com / 123');
    console.log('🏪 Restaurant: kiranas@test.com / 123');
    console.log('⚙️  Admin: admin@foodnow.com / admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed if called directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('🎉 Seed completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seed failed:', error);
      process.exit(1);
    });
}

module.exports = seed;