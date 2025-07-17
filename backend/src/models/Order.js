const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Order Identification
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  trackingId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Customer Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Service Details
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  serviceType: {
    type: String,
    enum: ['subscription', 'payasyougo'],
    required: true
  },
  
  // Order Details
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit: {
    type: String,
    enum: ['kg', 'pair', 'm2', 'item'],
    required: true
  },
  
  // Pricing
  basePrice: {
    type: Number,
    required: true
  },
  ecoFriendlyUpcharge: {
    type: Number,
    default: 0
  },
  expressDeliveryCharge: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'ZAR'
  },
  
  // Options
  isEcoFriendly: {
    type: Boolean,
    default: false
  },
  isExpressDelivery: {
    type: Boolean,
    default: false
  },
  
  // Staff Assignment
  assignedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    default: null
  },
  staffAssignedAt: {
    type: Date,
    default: null
  },
  
  // Addresses
  pickupAddress: {
    street: String,
    city: String,
    province: String,
    postalCode: String,
    country: { type: String, default: 'South Africa' },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    instructions: String
  },
  deliveryAddress: {
    street: String,
    city: String,
    province: String,
    postalCode: String,
    country: { type: String, default: 'South Africa' },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    instructions: String
  },
  
  // Scheduling
  scheduledPickupTime: {
    type: Date,
    required: true
  },
  scheduledDeliveryTime: {
    type: Date,
    default: null
  },
  actualPickupTime: {
    type: Date,
    default: null
  },
  actualDeliveryTime: {
    type: Date,
    default: null
  },
  
  // Status Tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'picked_up', 'in_progress', 'ready_for_delivery', 'in_transit', 'delivered', 'completed', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Tracking Information
  currentLocation: {
    latitude: {
      type: Number,
      default: -26.2041 // Default Johannesburg coordinates
    },
    longitude: {
      type: Number,
      default: 28.0473
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  
  // Special Instructions
  specialInstructions: {
    type: String,
    maxlength: 500
  },
  
  // Items Details (for detailed tracking)
  items: [{
    description: String,
    quantity: Number,
    condition: {
      type: String,
      enum: ['good', 'stained', 'damaged', 'delicate'],
      default: 'good'
    },
    notes: String,
    images: [String] // URLs to item images
  }],
  
  // Quality Control
  qualityCheck: {
    passed: {
      type: Boolean,
      default: null
    },
    checkedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff'
    },
    checkedAt: Date,
    notes: String,
    issues: [{
      type: String,
      description: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      }
    }]
  },
  
  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partial'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'subscription', 'free_kg'],
    default: 'card'
  },
  paymentReference: String,
  paidAt: Date,
  
  // Subscription Specific
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    default: null
  },
  kgUsedFromSubscription: {
    type: Number,
    default: 0
  },
  kgUsedFromRollover: {
    type: Number,
    default: 0
  },
  kgUsedFromFree: {
    type: Number,
    default: 0
  },
  
  // Promotions
  appliedPromotion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Promotion',
    default: null
  },
  promotionDiscount: {
    type: Number,
    default: 0
  },
  
  // Ratings and Reviews
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  review: {
    type: String,
    maxlength: 1000,
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  
  // Offline Support
  isOfflineOrder: {
    type: Boolean,
    default: false
  },
  offlineTrackingId: String,
  syncedAt: {
    type: Date,
    default: null
  },
  
  // Cancellation
  cancellationReason: String,
  cancelledAt: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  
  // Delivery Information
  deliveryDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    default: null
  },
  deliveryNotes: String,
  deliveryProof: {
    signature: String, // Base64 encoded signature
    photo: String,     // URL to delivery photo
    timestamp: Date
  },
  
  // Metadata
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

// Indexes for performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ trackingId: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ assignedStaff: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ scheduledPickupTime: 1 });
orderSchema.index({ serviceType: 1 });
orderSchema.index({ isOfflineOrder: 1 });

// Virtual for estimated delivery time
orderSchema.virtual('estimatedDeliveryTime').get(function() {
  if (this.scheduledDeliveryTime) return this.scheduledDeliveryTime;
  
  // Calculate based on service type
  const baseHours = this.isExpressDelivery ? 3 : 24;
  const pickupTime = this.actualPickupTime || this.scheduledPickupTime;
  
  return new Date(pickupTime.getTime() + (baseHours * 60 * 60 * 1000));
});

// Virtual for order duration
orderSchema.virtual('orderDuration').get(function() {
  if (!this.actualDeliveryTime) return null;
  
  const startTime = this.actualPickupTime || this.scheduledPickupTime;
  const endTime = this.actualDeliveryTime;
  
  return Math.round((endTime - startTime) / (1000 * 60 * 60)); // in hours
});

// Virtual for is late
orderSchema.virtual('isLate').get(function() {
  if (this.status === 'delivered' || this.status === 'completed') return false;
  
  const now = new Date();
  const estimatedTime = this.estimatedDeliveryTime;
  
  return now > estimatedTime;
});

// Pre-save middleware to generate order number and tracking ID
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    if (!this.orderNumber) {
      this.orderNumber = this.generateOrderNumber();
    }
    if (!this.trackingId) {
      this.trackingId = this.generateTrackingId();
    }
  }
  next();
});

// Method to generate order number
orderSchema.methods.generateOrderNumber = function() {
  const prefix = 'CLN';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// Method to generate tracking ID
orderSchema.methods.generateTrackingId = function() {
  if (this.isOfflineOrder) {
    return `OFFLINE-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }
  
  const prefix = 'TRK';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// Method to update status
orderSchema.methods.updateStatus = function(newStatus, notes = '', updatedBy = null) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    notes: notes,
    updatedBy: updatedBy
  });
  
  // Update timestamps based on status
  switch (newStatus) {
    case 'picked_up':
      this.actualPickupTime = new Date();
      break;
    case 'delivered':
      this.actualDeliveryTime = new Date();
      break;
    case 'cancelled':
      this.cancelledAt = new Date();
      if (updatedBy) this.cancelledBy = updatedBy;
      break;
  }
  
  return this.save();
};

// Method to calculate total amount
orderSchema.methods.calculateTotal = function() {
  let total = this.basePrice;
  
  if (this.isEcoFriendly) {
    total += this.ecoFriendlyUpcharge;
  }
  
  if (this.isExpressDelivery) {
    total += this.expressDeliveryCharge;
  }
  
  total -= this.discountAmount;
  total -= this.promotionDiscount;
  
  this.totalAmount = Math.max(0, total);
  return this.totalAmount;
};

// Method to add review
orderSchema.methods.addReview = function(rating, review) {
  this.rating = rating;
  this.review = review;
  this.reviewedAt = new Date();
  return this.save();
};

// Method to update location
orderSchema.methods.updateLocation = function(latitude, longitude) {
  this.currentLocation = {
    latitude: latitude,
    longitude: longitude,
    lastUpdated: new Date()
  };
  return this.save();
};

// Static method to get orders by user
orderSchema.statics.getOrdersByUser = function(userId, page = 1, limit = 10) {
  return this.find({ user: userId })
    .populate('service', 'name type')
    .populate('assignedStaff', 'firstName lastName rating')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

// Static method to get orders by staff
orderSchema.statics.getOrdersByStaff = function(staffId, status = null) {
  const query = { assignedStaff: staffId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('user', 'firstName lastName phoneNumber')
    .populate('service', 'name type')
    .sort({ scheduledPickupTime: 1 });
};

// Static method to get orders by status
orderSchema.statics.getOrdersByStatus = function(status) {
  return this.find({ status: status })
    .populate('user', 'firstName lastName phoneNumber')
    .populate('service', 'name type')
    .populate('assignedStaff', 'firstName lastName')
    .sort({ scheduledPickupTime: 1 });
};

// Static method to get offline orders
orderSchema.statics.getOfflineOrders = function() {
  return this.find({ isOfflineOrder: true, syncedAt: null })
    .sort({ createdAt: 1 });
};

module.exports = mongoose.model('Order', orderSchema);