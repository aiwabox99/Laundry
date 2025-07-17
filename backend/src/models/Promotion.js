const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  
  // Promotion Type
  type: {
    type: String,
    enum: ['percentage', 'fixed_amount', 'free_service', 'buy_one_get_one'],
    required: true
  },
  
  // Discount Details
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  maxDiscountAmount: {
    type: Number,
    default: null // null means no limit
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  
  // Validity
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  
  // Usage Limits
  usageLimit: {
    type: Number,
    default: null // null means unlimited
  },
  usageCount: {
    type: Number,
    default: 0
  },
  userUsageLimit: {
    type: Number,
    default: 1 // How many times a single user can use this promotion
  },
  
  // Applicable Services
  applicableServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  applicableServiceTypes: [{
    type: String,
    enum: ['subscription', 'payasyougo', 'laundry', 'shoe_cleaning', 'carpet_cleaning', 'mattress_cleaning']
  }],
  
  // User Restrictions
  applicableToNewUsers: {
    type: Boolean,
    default: false
  },
  applicableToExistingUsers: {
    type: Boolean,
    default: true
  },
  
  // Geographic Restrictions
  applicableRegions: [{
    type: String // City or province names
  }],
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Usage Tracking
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usageCount: {
      type: Number,
      default: 1
    },
    lastUsed: {
      type: Date,
      default: Date.now
    },
    orders: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }]
  }],
  
  // Localization
  localizedNames: {
    en: String,
    af: String,
    zu: String,
    xh: String
  },
  localizedDescriptions: {
    en: String,
    af: String,
    zu: String,
    xh: String
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
promotionSchema.index({ code: 1 });
promotionSchema.index({ startDate: 1, endDate: 1 });
promotionSchema.index({ isActive: 1 });
promotionSchema.index({ type: 1 });

// Virtual for is expired
promotionSchema.virtual('isExpired').get(function() {
  return new Date() > this.endDate;
});

// Virtual for is started
promotionSchema.virtual('isStarted').get(function() {
  return new Date() >= this.startDate;
});

// Virtual for is valid
promotionSchema.virtual('isValid').get(function() {
  return this.isActive && this.isStarted && !this.isExpired;
});

// Virtual for usage percentage
promotionSchema.virtual('usagePercentage').get(function() {
  if (!this.usageLimit) return 0;
  return Math.round((this.usageCount / this.usageLimit) * 100);
});

// Method to check if user can use promotion
promotionSchema.methods.canUserUse = function(userId) {
  if (!this.isValid) return false;
  
  if (this.usageLimit && this.usageCount >= this.usageLimit) {
    return false;
  }
  
  const userUsage = this.usedBy.find(usage => usage.user.toString() === userId.toString());
  if (userUsage && userUsage.usageCount >= this.userUsageLimit) {
    return false;
  }
  
  return true;
};

// Method to use promotion
promotionSchema.methods.usePromotion = function(userId, orderId) {
  if (!this.canUserUse(userId)) {
    throw new Error('Promotion cannot be used by this user');
  }
  
  this.usageCount += 1;
  
  const userUsage = this.usedBy.find(usage => usage.user.toString() === userId.toString());
  if (userUsage) {
    userUsage.usageCount += 1;
    userUsage.lastUsed = new Date();
    userUsage.orders.push(orderId);
  } else {
    this.usedBy.push({
      user: userId,
      usageCount: 1,
      lastUsed: new Date(),
      orders: [orderId]
    });
  }
  
  return this.save();
};

// Method to calculate discount
promotionSchema.methods.calculateDiscount = function(orderAmount) {
  if (orderAmount < this.minOrderAmount) return 0;
  
  let discount = 0;
  
  switch (this.type) {
    case 'percentage':
      discount = (orderAmount * this.discountValue) / 100;
      break;
    case 'fixed_amount':
      discount = this.discountValue;
      break;
    case 'free_service':
      discount = orderAmount; // Full discount
      break;
    case 'buy_one_get_one':
      discount = orderAmount / 2; // 50% discount
      break;
  }
  
  // Apply maximum discount limit
  if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
    discount = this.maxDiscountAmount;
  }
  
  return Math.min(discount, orderAmount);
};

// Static method to get active promotions
promotionSchema.statics.getActivePromotions = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).sort({ createdAt: -1 });
};

// Static method to get promotions by code
promotionSchema.statics.getByCode = function(code) {
  return this.findOne({ 
    code: code.toUpperCase(),
    isActive: true 
  });
};

// Static method to get user applicable promotions
promotionSchema.statics.getUserApplicablePromotions = function(userId, isNewUser = false) {
  const now = new Date();
  const query = {
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  };
  
  if (isNewUser) {
    query.applicableToNewUsers = true;
  } else {
    query.applicableToExistingUsers = true;
  }
  
  return this.find(query).sort({ discountValue: -1 });
};

module.exports = mongoose.model('Promotion', promotionSchema);