const express = require('express');
const Notification = require('../models/Notification');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Get user notifications
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  
  const notifications = await Notification.getUserNotifications(
    req.user._id,
    parseInt(page),
    parseInt(limit)
  );
  
  res.json({
    success: true,
    data: notifications
  });
}));

// Get unread count
router.get('/unread-count', asyncHandler(async (req, res) => {
  const count = await Notification.getUnreadCount(req.user._id);
  
  res.json({
    success: true,
    data: { count }
  });
}));

// Mark notification as read
router.put('/:id/read', asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  
  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }
  
  if (notification.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
  
  await notification.markAsRead();
  
  res.json({
    success: true,
    message: 'Notification marked as read'
  });
}));

// Mark all notifications as read
router.put('/mark-all-read', asyncHandler(async (req, res) => {
  await Notification.markAllAsRead(req.user._id);
  
  res.json({
    success: true,
    message: 'All notifications marked as read'
  });
}));

module.exports = router;