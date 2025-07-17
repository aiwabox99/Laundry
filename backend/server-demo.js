const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:19006'],
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// In-memory data for demo
const demoData = {
  services: [
    {
      id: '1',
      name: 'Starter Plan',
      description: 'Perfect for individuals with light laundry needs',
      category: 'subscription',
      type: 'laundry',
      kgLimit: 30,
      price: 249,
      currency: 'ZAR',
      features: [
        { name: 'Monthly pickup & delivery', included: true },
        { name: 'Basic washing & folding', included: true },
        { name: 'SMS notifications', included: true }
      ]
    },
    {
      id: '2',
      name: 'Pro Plan',
      description: 'Ideal for small families and busy professionals',
      category: 'subscription',
      type: 'laundry',
      kgLimit: 40,
      price: 299,
      currency: 'ZAR',
      isPopular: true,
      features: [
        { name: 'Monthly pickup & delivery', included: true },
        { name: 'Premium washing & folding', included: true },
        { name: 'SMS & email notifications', included: true },
        { name: 'Express delivery available', included: true }
      ]
    },
    {
      id: '3',
      name: 'Shoe/Sneaker Cleaning',
      description: 'Professional cleaning for all types of footwear',
      category: 'payasyougo',
      type: 'shoe_cleaning',
      price: 45,
      currency: 'ZAR',
      unit: 'pair',
      features: [
        { name: 'Deep cleaning', included: true },
        { name: 'Deodorizing', included: true },
        { name: 'Conditioning', included: true }
      ]
    },
    {
      id: '4',
      name: 'Carpet Cleaning',
      description: 'Deep cleaning for carpets and rugs',
      category: 'payasyougo',
      type: 'carpet_cleaning',
      price: 199,
      currency: 'ZAR',
      unit: 'm2',
      features: [
        { name: 'Deep steam cleaning', included: true },
        { name: 'Stain removal', included: true },
        { name: 'Sanitization', included: true }
      ]
    }
  ],
  staff: [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Experienced laundry specialist with expertise in delicate fabrics and stain removal.',
      rating: 4.8,
      totalRatings: 45,
      yearsOfExperience: 5,
      specializations: ['delicate_fabrics', 'stain_removal', 'eco_friendly'],
      isAvailable: true
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      bio: 'Reliable delivery driver with excellent customer service skills.',
      rating: 4.6,
      totalRatings: 32,
      yearsOfExperience: 3,
      specializations: ['express_service'],
      isAvailable: true
    }
  ],
  promotions: [
    {
      id: '1',
      name: 'Carpet Cleaning Special',
      description: '10% off carpet cleaning services',
      code: 'CARPET10',
      type: 'percentage',
      discountValue: 10,
      isActive: true
    },
    {
      id: '2',
      name: 'New User Welcome',
      description: 'R50 off your first order',
      code: 'WELCOME50',
      type: 'fixed_amount',
      discountValue: 50,
      isActive: true
    }
  ]
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    message: 'Cleanic API is running (Demo Mode - No Database)'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Cleanic API (Demo Mode)',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health',
    note: 'This is a demo version running without database'
  });
});

// API Routes

// Get all services
app.get('/api/services', (req, res) => {
  const { category, type } = req.query;
  let services = demoData.services;
  
  if (category) {
    services = services.filter(s => s.category === category);
  }
  
  if (type) {
    services = services.filter(s => s.type === type);
  }
  
  res.json({
    success: true,
    data: services
  });
});

// Get subscription plans
app.get('/api/services/subscriptions', (req, res) => {
  const subscriptions = demoData.services.filter(s => s.category === 'subscription');
  res.json({
    success: true,
    data: subscriptions
  });
});

// Get pay-as-you-go services
app.get('/api/services/payasyougo', (req, res) => {
  const payAsYouGo = demoData.services.filter(s => s.category === 'payasyougo');
  res.json({
    success: true,
    data: payAsYouGo
  });
});

// Get service by ID
app.get('/api/services/:id', (req, res) => {
  const service = demoData.services.find(s => s.id === req.params.id);
  
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }
  
  res.json({
    success: true,
    data: service
  });
});

// Get available staff
app.get('/api/staff', (req, res) => {
  const { specialization } = req.query;
  let staff = demoData.staff.filter(s => s.isAvailable);
  
  if (specialization) {
    staff = staff.filter(s => s.specializations.includes(specialization));
  }
  
  res.json({
    success: true,
    data: staff
  });
});

// Get staff by ID
app.get('/api/staff/:id', (req, res) => {
  const staff = demoData.staff.find(s => s.id === req.params.id);
  
  if (!staff) {
    return res.status(404).json({
      success: false,
      message: 'Staff member not found'
    });
  }
  
  res.json({
    success: true,
    data: staff
  });
});

// Get active promotions
app.get('/api/promotions', (req, res) => {
  const promotions = demoData.promotions.filter(p => p.isActive);
  res.json({
    success: true,
    data: promotions
  });
});

// Validate promotion code
app.post('/api/promotions/validate', (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Promotion code is required'
    });
  }
  
  const promotion = demoData.promotions.find(p => p.code === code.toUpperCase() && p.isActive);
  
  if (!promotion) {
    return res.status(404).json({
      success: false,
      message: 'Invalid promotion code'
    });
  }
  
  res.json({
    success: true,
    data: promotion,
    message: 'Promotion code is valid'
  });
});

// Demo authentication endpoints
app.post('/api/auth/register', (req, res) => {
  const { phoneNumber, firstName, lastName, password } = req.body;
  
  if (!phoneNumber || !firstName || !lastName || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
  
  // Simulate user registration
  const user = {
    id: Date.now().toString(),
    phoneNumber,
    firstName,
    lastName,
    isVerified: false,
    preferredLanguage: 'en',
    referralCode: `CLEAN${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  };
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully. Please verify your phone number.',
    data: {
      user,
      token: 'demo-jwt-token-' + Date.now()
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { phoneNumber, password } = req.body;
  
  if (!phoneNumber || !password) {
    return res.status(400).json({
      success: false,
      message: 'Phone number and password are required'
    });
  }
  
  // Simulate login
  const user = {
    id: '1',
    phoneNumber,
    firstName: 'Demo',
    lastName: 'User',
    isVerified: true,
    preferredLanguage: 'en',
    ecoPoints: 25,
    totalOrders: 8,
    totalSpent: 1200,
    referralCode: 'CLEANDEMO'
  };
  
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token: 'demo-jwt-token-' + Date.now()
    }
  });
});

app.post('/api/auth/verify-phone', (req, res) => {
  const { phoneNumber, verificationCode } = req.body;
  
  if (!phoneNumber || !verificationCode) {
    return res.status(400).json({
      success: false,
      message: 'Phone number and verification code are required'
    });
  }
  
  if (verificationCode !== '1234') {
    return res.status(400).json({
      success: false,
      message: 'Invalid verification code'
    });
  }
  
  res.json({
    success: true,
    message: 'Phone number verified successfully',
    data: {
      user: {
        id: '1',
        phoneNumber,
        firstName: 'Demo',
        lastName: 'User',
        isVerified: true
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    availableRoutes: [
      'GET /health',
      'GET /api/services',
      'GET /api/services/subscriptions',
      'GET /api/services/payasyougo',
      'GET /api/staff',
      'GET /api/promotions',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/auth/verify-phone'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Cleanic API Demo Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`💡 This is a demo version running without database`);
  console.log(`📚 Available endpoints:`);
  console.log(`   Health Check: GET http://localhost:${PORT}/health`);
  console.log(`   Services: GET http://localhost:${PORT}/api/services`);
  console.log(`   Staff: GET http://localhost:${PORT}/api/staff`);
  console.log(`   Promotions: GET http://localhost:${PORT}/api/promotions`);
  console.log(`   Auth: POST http://localhost:${PORT}/api/auth/register`);
});

module.exports = app;