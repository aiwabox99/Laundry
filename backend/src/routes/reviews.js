const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Get user reviews
router.get('/', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Reviews feature coming soon'
  });
}));

module.exports = router;