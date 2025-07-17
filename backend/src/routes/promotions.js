const express = require('express');
const Promotion = require('../models/Promotion');
const { optionalAuthMiddleware } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Get active promotions
router.get('/', optionalAuthMiddleware, asyncHandler(async (req, res) => {
  const promotions = await Promotion.getActivePromotions();
  
  res.json({
    success: true,
    data: promotions
  });
}));

// Validate promotion code
router.post('/validate', optionalAuthMiddleware, asyncHandler(async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Promotion code is required'
    });
  }
  
  const promotion = await Promotion.getByCode(code);
  
  if (!promotion) {
    return res.status(404).json({
      success: false,
      message: 'Invalid promotion code'
    });
  }
  
  if (!promotion.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Promotion code has expired or is not active'
    });
  }
  
  res.json({
    success: true,
    data: promotion,
    message: 'Promotion code is valid'
  });
}));

module.exports = router;