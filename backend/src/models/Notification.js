const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Recipient
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Notification Content
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  
  // Notification Type
  type: {
    type: String,
    enum: [
      'order_confirmation',
      'order_status_update',
      'payment_confirmation',
      'eco_points_awarded',
      'referral_bonus',
      'promotion_available',
      'subscription_reminder',
      'delivery_update',
      'review_request',
      'system_message',
      'staff_assignment',
      'challenge_completed',
      'badge_earned'
    ],
    required: true
  },
  
  // Priority Level
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
    default: 'pending'
  },
  
  // Read Status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  
  // Delivery Channels
  channels: {
    push: {
      enabled: { type: Boolean, default: true },
      sent: { type: Boolean, default: false },
      sentAt: Date,
      response: String
    },
    sms: {
      enabled: { type: Boolean, default: false },
      sent: { type: Boolean, default: false },
      sentAt: Date,
      response: String
    },
    email: {
      enabled: { type: Boolean, default: false },
      sent: { type: Boolean, default: false },
      sentAt: Date,
      response: String
    }
  },
  
  // Related Objects
  relatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  relatedPromotion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Promotion',
    default: null
  },
  relatedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    default: null
  },
  
  // Action Data
  actionData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  
  // Deep Link
  deepLink: {
    type: String,
    default: null
  },
  
  // Scheduling
  scheduledFor: {
    type: Date,
    default: null
  },
  
  // Expiry
  expiresAt: {
    type: Date,
    default: null
  },
  
  // Localization
  localizedTitles: {
    en: String,
    af: String,
    zu: String,
    xh: String
  },
  localizedMessages: {
    en: String,
    af: String,
    zu: String,
    xh: String
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ expiresAt: 1 });

// Virtual for is expired
notificationSchema.virtual('isExpired').get(function() {
  return this.expiresAt && new Date() > this.expiresAt;
});

// Virtual for is scheduled
notificationSchema.virtual('isScheduled').get(function() {
  return this.scheduledFor && new Date() < this.scheduledFor;
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Method to get localized content
notificationSchema.methods.getLocalizedContent = function(language = 'en') {
  return {
    title: this.localizedTitles[language] || this.title,
    message: this.localizedMessages[language] || this.message
  };
};

// Method to update delivery status
notificationSchema.methods.updateDeliveryStatus = function(channel, sent, response = null) {
  this.channels[channel].sent = sent;
  this.channels[channel].sentAt = new Date();
  if (response) {
    this.channels[channel].response = response;
  }
  
  // Update overall status
  const allChannels = Object.values(this.channels);
  const enabledChannels = allChannels.filter(ch => ch.enabled);
  const sentChannels = enabledChannels.filter(ch => ch.sent);
  
  if (sentChannels.length === enabledChannels.length) {
    this.status = 'delivered';
  } else if (sentChannels.length > 0) {
    this.status = 'sent';
  }
  
  return this.save();
};

// Static method to create order notification
notificationSchema.statics.createOrderNotification = function(userId, orderId, type, additionalData = {}) {
  const notificationData = {
    user: userId,
    relatedOrder: orderId,
    type: type,
    ...additionalData
  };
  
  // Set default content based on type
  switch (type) {
    case 'order_confirmation':
      notificationData.title = 'Order Confirmed';
      notificationData.message = 'Your order has been confirmed and is being processed.';
      break;
    case 'order_status_update':
      notificationData.title = 'Order Status Update';
      notificationData.message = 'Your order status has been updated.';
      break;
    case 'delivery_update':
      notificationData.title = 'Delivery Update';
      notificationData.message = 'Your order is on its way!';
      break;
    default:
      notificationData.title = 'Order Update';
      notificationData.message = 'There is an update on your order.';
  }
  
  return this.create(notificationData);
};

// Static method to create eco points notification
notificationSchema.statics.createEcoPointsNotification = function(userId, points, reason = 'eco-friendly service') {
  return this.create({
    user: userId,
    type: 'eco_points_awarded',
    title: 'Eco Points Earned!',
    message: `You've earned ${points} eco points for choosing ${reason}. Keep saving the planet!`,
    actionData: { points, reason }
  });
};

// Static method to create referral notification
notificationSchema.statics.createReferralNotification = function(userId, amount, referredUser) {
  return this.create({
    user: userId,
    type: 'referral_bonus',
    title: 'Referral Bonus Earned!',
    message: `You've earned R${amount} for referring a friend to Cleanic!`,
    actionData: { amount, referredUser }
  });
};

// Static method to get user notifications
notificationSchema.statics.getUserNotifications = function(userId, page = 1, limit = 20) {
  return this.find({ user: userId })
    .populate('relatedOrder', 'orderNumber status')
    .populate('relatedPromotion', 'name code')
    .populate('relatedStaff', 'firstName lastName')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ user: userId, isRead: false });
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

// Static method to get pending notifications for delivery
notificationSchema.statics.getPendingNotifications = function() {
  const now = new Date();
  return this.find({
    status: 'pending',
    $or: [
      { scheduledFor: null },
      { scheduledFor: { $lte: now } }
    ],
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: now } }
    ]
  }).populate('user', 'notificationPreferences preferredLanguage');
};

module.exports = mongoose.model('Notification', notificationSchema);