const express = require('express');
const Order = require('../models/Order');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Get user orders
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const orders = await Order.getOrdersByUser(req.user._id, parseInt(page), parseInt(limit));
  
  res.json({
    success: true,
    data: orders
  });
}));

// Get order by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('service', 'name type')
    .populate('assignedStaff', 'firstName lastName rating');
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  // Check if order belongs to user
  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
  
  res.json({
    success: true,
    data: order
  });
}));

// Track order
router.get('/:id/track', asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .select('orderNumber trackingId status statusHistory currentLocation estimatedDeliveryTime')
    .populate('assignedStaff', 'firstName lastName phoneNumber');
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  // Check if order belongs to user
  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
  
  res.json({
    success: true,
    data: {
      orderNumber: order.orderNumber,
      trackingId: order.trackingId,
      status: order.status,
      statusHistory: order.statusHistory,
      currentLocation: order.currentLocation,
      estimatedDeliveryTime: order.estimatedDeliveryTime,
      assignedStaff: order.assignedStaff
    }
  });
}));

module.exports = router;