const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Get user analytics
router.get('/user', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      totalOrders: req.user.totalOrders,
      totalSpent: req.user.totalSpent,
      ecoPoints: req.user.ecoPoints,
      waterSaved: req.user.waterSaved,
      referralEarnings: req.user.referralEarnings
    }
  });
}));

module.exports = router;