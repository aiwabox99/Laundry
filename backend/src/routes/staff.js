const express = require('express');
const Staff = require('../models/Staff');
const { optionalAuthMiddleware } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Get available staff
router.get('/', optionalAuthMiddleware, asyncHandler(async (req, res) => {
  const { date, time, specialization } = req.query;
  
  let query = { isActive: true, isAvailable: true };
  
  if (specialization) {
    query.specializations = specialization;
  }
  
  const staff = await Staff.find(query)
    .select('firstName lastName bio rating totalRatings yearsOfExperience specializations languages profileImage')
    .sort({ rating: -1, totalRatings: -1 });
  
  // Filter by availability if date and time provided
  let availableStaff = staff;
  if (date && time) {
    const checkDate = new Date(date);
    availableStaff = staff.filter(member => 
      member.isAvailableAt(checkDate, time)
    );
  }
  
  res.json({
    success: true,
    data: availableStaff
  });
}));

// Get staff by ID
router.get('/:id', optionalAuthMiddleware, asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id)
    .select('firstName lastName bio rating totalRatings yearsOfExperience specializations languages profileImage skills workingHours reviews')
    .populate('reviews.user', 'firstName lastName')
    .populate('reviews.order', 'orderNumber');
  
  if (!staff) {
    return res.status(404).json({
      success: false,
      message: 'Staff member not found'
    });
  }
  
  if (!staff.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Staff member is not available'
    });
  }
  
  res.json({
    success: true,
    data: staff
  });
}));

// Get top rated staff
router.get('/top-rated', optionalAuthMiddleware, asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  const staff = await Staff.getTopRatedStaff(parseInt(limit));
  
  res.json({
    success: true,
    data: staff
  });
}));

module.exports = router;