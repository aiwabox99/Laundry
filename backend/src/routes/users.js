const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Get user profile
router.get('/profile', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        phoneNumber: req.user.phoneNumber,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        preferredLanguage: req.user.preferredLanguage,
        ecoPoints: req.user.ecoPoints,
        totalOrders: req.user.totalOrders,
        totalSpent: req.user.totalSpent,
        waterSaved: req.user.waterSaved,
        referralCode: req.user.referralCode,
        addresses: req.user.addresses
      }
    }
  });
}));

module.exports = router;