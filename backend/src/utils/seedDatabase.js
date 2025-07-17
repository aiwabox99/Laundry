const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Staff = require('../models/Staff');
const Service = require('../models/Service');
const Order = require('../models/Order');
const Promotion = require('../models/Promotion');
const Notification = require('../models/Notification');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cleanic_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Clear existing data
const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Staff.deleteMany({});
    await Service.deleteMany({});
    await Order.deleteMany({});
    await Promotion.deleteMany({});
    await Notification.deleteMany({});
    console.log('🗑️ Cleared existing data');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
};

// Seed Users
const seedUsers = async () => {
  const users = [
    {
      phoneNumber: '+27123456789',
      email: 'john.doe@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      preferredLanguage: 'en',
      isVerified: true,
      role: 'user',
      addresses: [{
        type: 'home',
        street: '123 Main Street',
        city: 'Johannesburg',
        province: 'Gauteng',
        postalCode: '2001',
        isDefault: true,
        coordinates: {
          latitude: -26.2041,
          longitude: 28.0473
        }
      }],
      ecoPoints: 25,
      totalOrders: 8,
      totalSpent: 1200,
      waterSaved: 250
    },
    {
      phoneNumber: '+27123456790',
      email: 'jane.smith@example.com',
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Smith',
      preferredLanguage: 'en',
      isVerified: true,
      role: 'user',
      addresses: [{
        type: 'home',
        street: '456 Oak Avenue',
        city: 'Cape Town',
        province: 'Western Cape',
        postalCode: '8001',
        isDefault: true,
        coordinates: {
          latitude: -33.9249,
          longitude: 18.4241
        }
      }],
      ecoPoints: 15,
      totalOrders: 5,
      totalSpent: 750,
      waterSaved: 150
    },
    {
      phoneNumber: '+27123456791',
      email: 'admin@cleanic.co.za',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      preferredLanguage: 'en',
      isVerified: true,
      role: 'admin',
      addresses: [{
        type: 'work',
        street: '789 Business District',
        city: 'Johannesburg',
        province: 'Gauteng',
        postalCode: '2001',
        isDefault: true,
        coordinates: {
          latitude: -26.2041,
          longitude: 28.0473
        }
      }]
    }
  ];

  for (const userData of users) {
    const user = new User(userData);
    await user.save();
  }

  console.log('👥 Created sample users');
  return await User.find({});
};

// Seed Staff
const seedStaff = async () => {
  const staff = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.staff@cleanic.co.za',
      phoneNumber: '+27123456800',
      employeeId: 'EMP001',
      position: 'cleaner',
      department: 'laundry',
      hireDate: new Date('2023-01-15'),
      yearsOfExperience: 5,
      bio: 'Experienced laundry specialist with expertise in delicate fabrics and stain removal.',
      rating: 4.8,
      totalRatings: 45,
      ratingSum: 216,
      totalOrders: 120,
      completedOrders: 115,
      workingHours: {
        monday: { start: '08:00', end: '17:00', isWorking: true },
        tuesday: { start: '08:00', end: '17:00', isWorking: true },
        wednesday: { start: '08:00', end: '17:00', isWorking: true },
        thursday: { start: '08:00', end: '17:00', isWorking: true },
        friday: { start: '08:00', end: '17:00', isWorking: true },
        saturday: { start: '08:00', end: '14:00', isWorking: true },
        sunday: { start: '00:00', end: '00:00', isWorking: false }
      },
      skills: [
        { name: 'Stain Removal', level: 'expert' },
        { name: 'Delicate Fabrics', level: 'advanced' },
        { name: 'Eco-Friendly Cleaning', level: 'advanced' }
      ],
      specializations: ['delicate_fabrics', 'stain_removal', 'eco_friendly'],
      languages: [
        { language: 'en', proficiency: 'native' },
        { language: 'af', proficiency: 'fluent' }
      ]
    },
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.staff@cleanic.co.za',
      phoneNumber: '+27123456801',
      employeeId: 'EMP002',
      position: 'driver',
      department: 'delivery',
      hireDate: new Date('2023-03-20'),
      yearsOfExperience: 3,
      bio: 'Reliable delivery driver with excellent customer service skills.',
      rating: 4.6,
      totalRatings: 32,
      ratingSum: 147,
      totalOrders: 85,
      completedOrders: 82,
      workingHours: {
        monday: { start: '07:00', end: '16:00', isWorking: true },
        tuesday: { start: '07:00', end: '16:00', isWorking: true },
        wednesday: { start: '07:00', end: '16:00', isWorking: true },
        thursday: { start: '07:00', end: '16:00', isWorking: true },
        friday: { start: '07:00', end: '16:00', isWorking: true },
        saturday: { start: '07:00', end: '13:00', isWorking: true },
        sunday: { start: '00:00', end: '00:00', isWorking: false }
      },
      skills: [
        { name: 'Customer Service', level: 'advanced' },
        { name: 'Route Planning', level: 'intermediate' }
      ],
      specializations: ['express_service'],
      languages: [
        { language: 'en', proficiency: 'native' },
        { language: 'zu', proficiency: 'fluent' }
      ]
    },
    {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.staff@cleanic.co.za',
      phoneNumber: '+27123456802',
      employeeId: 'EMP003',
      position: 'supervisor',
      department: 'laundry',
      hireDate: new Date('2022-08-10'),
      yearsOfExperience: 8,
      bio: 'Experienced supervisor ensuring quality control and team coordination.',
      rating: 4.9,
      totalRatings: 28,
      ratingSum: 137,
      totalOrders: 95,
      completedOrders: 93,
      workingHours: {
        monday: { start: '08:00', end: '17:00', isWorking: true },
        tuesday: { start: '08:00', end: '17:00', isWorking: true },
        wednesday: { start: '08:00', end: '17:00', isWorking: true },
        thursday: { start: '08:00', end: '17:00', isWorking: true },
        friday: { start: '08:00', end: '17:00', isWorking: true },
        saturday: { start: '08:00', end: '14:00', isWorking: true },
        sunday: { start: '00:00', end: '00:00', isWorking: false }
      },
      skills: [
        { name: 'Quality Control', level: 'expert' },
        { name: 'Team Management', level: 'advanced' },
        { name: 'Process Optimization', level: 'advanced' }
      ],
      specializations: ['bulk_orders', 'delicate_fabrics'],
      languages: [
        { language: 'en', proficiency: 'native' },
        { language: 'af', proficiency: 'fluent' },
        { language: 'xh', proficiency: 'intermediate' }
      ]
    }
  ];

  for (const staffData of staff) {
    const staffMember = new Staff(staffData);
    await staffMember.save();
  }

  console.log('👷 Created sample staff');
  return await Staff.find({});
};

// Seed Services
const seedServices = async () => {
  const services = [
    // Subscription Plans
    {
      name: 'Starter Plan',
      description: 'Perfect for individuals with light laundry needs',
      category: 'subscription',
      type: 'laundry',
      kgLimit: 30,
      price: 249,
      displayOrder: 1,
      features: [
        { name: 'Monthly pickup & delivery', included: true },
        { name: 'Basic washing & folding', included: true },
        { name: 'SMS notifications', included: true },
        { name: 'Express delivery', included: false }
      ],
      localizedNames: {
        en: 'Starter Plan',
        af: 'Beginners Plan',
        zu: 'Uhlelo Lwekuqala',
        xh: 'Isicwangciso Sokuqala'
      },
      localizedDescriptions: {
        en: 'Perfect for individuals with light laundry needs',
        af: 'Perfek vir individue met ligte wasbehoeftes',
        zu: 'Okuhle kwabantu abangabanye abadinga ukuwasha okuncane',
        xh: 'Igqibelele kubantu abangabanye abaneemfuno zokuhlamba ezilula'
      }
    },
    {
      name: 'Pro Plan',
      description: 'Ideal for small families and busy professionals',
      category: 'subscription',
      type: 'laundry',
      kgLimit: 40,
      price: 299,
      displayOrder: 2,
      isPopular: true,
      features: [
        { name: 'Monthly pickup & delivery', included: true },
        { name: 'Premium washing & folding', included: true },
        { name: 'SMS & email notifications', included: true },
        { name: 'Express delivery available', included: true }
      ],
      localizedNames: {
        en: 'Pro Plan',
        af: 'Pro Plan',
        zu: 'Uhlelo Lwe-Pro',
        xh: 'Isicwangciso se-Pro'
      }
    },
    {
      name: 'Family Plan',
      description: 'Great for families with regular laundry needs',
      category: 'subscription',
      type: 'laundry',
      kgLimit: 55,
      price: 399,
      displayOrder: 3,
      features: [
        { name: 'Monthly pickup & delivery', included: true },
        { name: 'Premium washing & folding', included: true },
        { name: 'Stain removal included', included: true },
        { name: 'Priority customer support', included: true }
      ],
      localizedNames: {
        en: 'Family Plan',
        af: 'Familie Plan',
        zu: 'Uhlelo Lwomndeni',
        xh: 'Isicwangciso Sosapho'
      }
    },
    {
      name: 'Family Plus',
      description: 'Premium family plan with extra benefits',
      category: 'subscription',
      type: 'laundry',
      kgLimit: 70,
      price: 499,
      displayOrder: 4,
      features: [
        { name: 'Monthly pickup & delivery', included: true },
        { name: 'Premium washing & folding', included: true },
        { name: 'Stain removal included', included: true },
        { name: 'Eco-friendly options', included: true },
        { name: 'Priority customer support', included: true }
      ]
    },
    {
      name: 'Business Plan',
      description: 'Designed for small businesses and bulk orders',
      category: 'subscription',
      type: 'laundry',
      kgLimit: 100,
      price: 799,
      displayOrder: 5,
      features: [
        { name: 'Weekly pickup & delivery', included: true },
        { name: 'Commercial-grade cleaning', included: true },
        { name: 'Bulk order discounts', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'Invoice billing', included: true }
      ]
    },

    // Pay-as-you-go Services
    {
      name: 'Shoe/Sneaker Cleaning',
      description: 'Professional cleaning for all types of footwear',
      category: 'payasyougo',
      type: 'shoe_cleaning',
      price: 45,
      unit: 'pair',
      displayOrder: 1,
      expressDeliveryAvailable: true,
      features: [
        { name: 'Deep cleaning', included: true },
        { name: 'Deodorizing', included: true },
        { name: 'Conditioning', included: true }
      ],
      localizedNames: {
        en: 'Shoe/Sneaker Cleaning',
        af: 'Skoen/Toekie Skoonmaak',
        zu: 'Ukuhlanza Izicathulo',
        xh: 'Ukucocwa Kwezihlangu'
      }
    },
    {
      name: 'Carpet Cleaning',
      description: 'Deep cleaning for carpets and rugs',
      category: 'payasyougo',
      type: 'carpet_cleaning',
      price: 199,
      unit: 'm2',
      displayOrder: 2,
      features: [
        { name: 'Deep steam cleaning', included: true },
        { name: 'Stain removal', included: true },
        { name: 'Sanitization', included: true }
      ],
      localizedNames: {
        en: 'Carpet Cleaning',
        af: 'Tapyt Skoonmaak',
        zu: 'Ukuhlanza Amakhabethe',
        xh: 'Ukucocwa Kweekhabethe'
      }
    },
    {
      name: 'Mattress Cleaning',
      description: 'Professional mattress deep cleaning service',
      category: 'payasyougo',
      type: 'mattress_cleaning',
      price: 399,
      unit: 'item',
      displayOrder: 3,
      features: [
        { name: 'Deep cleaning', included: true },
        { name: 'Dust mite removal', included: true },
        { name: 'Sanitization', included: true },
        { name: 'Deodorizing', included: true }
      ],
      localizedNames: {
        en: 'Mattress Cleaning',
        af: 'Matras Skoonmaak',
        zu: 'Ukuhlanza Ama-mattress',
        xh: 'Ukucocwa Kwee-mattress'
      }
    }
  ];

  for (const serviceData of services) {
    const service = new Service(serviceData);
    await service.save();
  }

  console.log('🛍️ Created sample services');
  return await Service.find({});
};

// Seed Promotions
const seedPromotions = async () => {
  const promotions = [
    {
      name: 'Carpet Cleaning Special',
      description: '10% off carpet cleaning services',
      code: 'CARPET10',
      type: 'percentage',
      discountValue: 10,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-08-01'),
      applicableServiceTypes: ['carpet_cleaning'],
      usageLimit: 100,
      localizedNames: {
        en: 'Carpet Cleaning Special',
        af: 'Tapyt Skoonmaak Spesiale',
        zu: 'Isikhathi Sokuhlanza Amakhabethe',
        xh: 'Ixesha Elikhethekileyo Lokucocwa Kweekhabethe'
      }
    },
    {
      name: 'New User Welcome',
      description: 'R50 off your first order',
      code: 'WELCOME50',
      type: 'fixed_amount',
      discountValue: 50,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      applicableToNewUsers: true,
      applicableToExistingUsers: false,
      usageLimit: null,
      userUsageLimit: 1
    },
    {
      name: 'Eco-Friendly Bonus',
      description: 'Free eco-friendly upgrade',
      code: 'ECOFREE',
      type: 'free_service',
      discountValue: 0,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      usageLimit: 50,
      userUsageLimit: 2
    }
  ];

  for (const promoData of promotions) {
    const promotion = new Promotion(promoData);
    await promotion.save();
  }

  console.log('🎉 Created sample promotions');
  return await Promotion.find({});
};

// Seed Orders
const seedOrders = async (users, services, staff) => {
  const orders = [
    {
      user: users[0]._id,
      service: services.find(s => s.name === 'Pro Plan')._id,
      serviceType: 'subscription',
      quantity: 25,
      unit: 'kg',
      basePrice: 299,
      totalAmount: 299,
      isEcoFriendly: true,
      assignedStaff: staff[0]._id,
      pickupAddress: {
        street: '123 Main Street',
        city: 'Johannesburg',
        province: 'Gauteng',
        postalCode: '2001',
        coordinates: { latitude: -26.2041, longitude: 28.0473 }
      },
      deliveryAddress: {
        street: '123 Main Street',
        city: 'Johannesburg',
        province: 'Gauteng',
        postalCode: '2001',
        coordinates: { latitude: -26.2041, longitude: 28.0473 }
      },
      scheduledPickupTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'card'
    },
    {
      user: users[1]._id,
      service: services.find(s => s.name === 'Shoe/Sneaker Cleaning')._id,
      serviceType: 'payasyougo',
      quantity: 2,
      unit: 'pair',
      basePrice: 90,
      expressDeliveryCharge: 99,
      totalAmount: 189,
      isExpressDelivery: true,
      assignedStaff: staff[1]._id,
      pickupAddress: {
        street: '456 Oak Avenue',
        city: 'Cape Town',
        province: 'Western Cape',
        postalCode: '8001',
        coordinates: { latitude: -33.9249, longitude: 18.4241 }
      },
      deliveryAddress: {
        street: '456 Oak Avenue',
        city: 'Cape Town',
        province: 'Western Cape',
        postalCode: '8001',
        coordinates: { latitude: -33.9249, longitude: 18.4241 }
      },
      scheduledPickupTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      status: 'in_progress',
      paymentStatus: 'paid',
      paymentMethod: 'card'
    }
  ];

  for (const orderData of orders) {
    const order = new Order(orderData);
    await order.save();
  }

  console.log('📦 Created sample orders');
  return await Order.find({});
};

// Seed Notifications
const seedNotifications = async (users, orders) => {
  const notifications = [
    {
      user: users[0]._id,
      type: 'order_confirmation',
      title: 'Order Confirmed',
      message: 'Your order has been confirmed and is being processed.',
      relatedOrder: orders[0]._id,
      priority: 'medium'
    },
    {
      user: users[0]._id,
      type: 'eco_points_awarded',
      title: 'Eco Points Earned!',
      message: 'You earned 1 eco point for choosing eco-friendly service.',
      priority: 'low'
    },
    {
      user: users[1]._id,
      type: 'order_status_update',
      title: 'Order Status Update',
      message: 'Your order is currently being processed.',
      relatedOrder: orders[1]._id,
      priority: 'medium'
    }
  ];

  for (const notificationData of notifications) {
    const notification = new Notification(notificationData);
    await notification.save();
  }

  console.log('🔔 Created sample notifications');
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    await clearDatabase();
    
    const users = await seedUsers();
    const staff = await seedStaff();
    const services = await seedServices();
    const promotions = await seedPromotions();
    const orders = await seedOrders(users, services, staff);
    await seedNotifications(users, orders);
    
    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created: ${users.length} users, ${staff.length} staff, ${services.length} services, ${promotions.length} promotions, ${orders.length} orders`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };