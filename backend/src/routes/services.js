const express = require('express');
const Service = require('../models/Service');
const { optionalAuthMiddleware } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Get all services
router.get('/', optionalAuthMiddleware, asyncHandler(async (req, res) => {
  const { category, type, language = 'en' } = req.query;
  
  const query = { isActive: true };
  if (category) query.category = category;
  if (type) query.type = type;
  
  const services = await Service.find(query).sort({ displayOrder: 1, price: 1 });
  
  // Localize service names and descriptions
  const localizedServices = services.map(service => ({
    ...service.toObject(),
    localizedName: service.localizedNames[language] || service.name,
    localizedDescription: service.localizedDescriptions[language] || service.description
  }));
  
  res.json({
    success: true,
    data: localizedServices
  });
}));

// Get subscription plans
router.get('/subscriptions', optionalAuthMiddleware, asyncHandler(async (req, res) => {
  const { language = 'en' } = req.query;
  
  const services = await Service.getSubscriptionPlans();
  
  const localizedServices = services.map(service => ({
    ...service.toObject(),
    localizedName: service.localizedNames[language] || service.name,
    localizedDescription: service.localizedDescriptions[language] || service.description
  }));
  
  res.json({
    success: true,
    data: localizedServices
  });
}));

// Get pay-as-you-go services
router.get('/payasyougo', optionalAuthMiddleware, asyncHandler(async (req, res) => {
  const { language = 'en' } = req.query;
  
  const services = await Service.getPayAsYouGoServices();
  
  const localizedServices = services.map(service => ({
    ...service.toObject(),
    localizedName: service.localizedNames[language] || service.name,
    localizedDescription: service.localizedDescriptions[language] || service.description
  }));
  
  res.json({
    success: true,
    data: localizedServices
  });
}));

// Get service by ID
router.get('/:id', optionalAuthMiddleware, asyncHandler(async (req, res) => {
  const { language = 'en' } = req.query;
  
  const service = await Service.findById(req.params.id);
  
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }
  
  if (!service.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Service is not available'
    });
  }
  
  const localizedService = {
    ...service.toObject(),
    localizedName: service.localizedNames[language] || service.name,
    localizedDescription: service.localizedDescriptions[language] || service.description
  };
  
  res.json({
    success: true,
    data: localizedService
  });
}));

module.exports = router;