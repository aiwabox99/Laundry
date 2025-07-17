const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['subscription', 'payasyougo'],
    required: true
  },
  type: {
    type: String,
    enum: ['laundry', 'shoe_cleaning', 'carpet_cleaning', 'mattress_cleaning', 'custom'],
    required: true
  },
  
  // Subscription specific fields
  kgLimit: {
    type: Number,
    default: null // null for pay-as-you-go services
  },
  duration: {
    type: Number, // in days
    default: 30 // monthly subscription
  },
  
  // Pricing
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'ZAR'
  },
  
  // Pay-as-you-go specific
  unit: {
    type: String,
    enum: ['pair', 'm2', 'kg', 'item'],
    default: 'item'
  },
  
  // Features
  features: [{
    name: String,
    description: String,
    included: {
      type: Boolean,
      default: true
    }
  }],
  
  // Availability
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  
  // Eco-friendly option
  ecoFriendlyAvailable: {
    type: Boolean,
    default: true
  },
  ecoFriendlyUpcharge: {
    type: Number,
    default: 0
  },
  
  // Express delivery
  expressDeliveryAvailable: {
    type: Boolean,
    default: false
  },
  expressDeliveryPrice: {
    type: Number,
    default: 99
  },
  
  // Metadata
  displayOrder: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: '#007AFF'
  },
  
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
serviceSchema.index({ category: 1, type: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ displayOrder: 1 });

// Virtual for localized name
serviceSchema.virtual('getLocalizedName').get(function() {
  return function(language = 'en') {
    return this.localizedNames[language] || this.name;
  };
});

// Virtual for localized description
serviceSchema.virtual('getLocalizedDescription').get(function() {
  return function(language = 'en') {
    return this.localizedDescriptions[language] || this.description;
  };
});

// Static method to get subscription plans
serviceSchema.statics.getSubscriptionPlans = function() {
  return this.find({ category: 'subscription', isActive: true })
    .sort({ displayOrder: 1, price: 1 });
};

// Static method to get pay-as-you-go services
serviceSchema.statics.getPayAsYouGoServices = function() {
  return this.find({ category: 'payasyougo', isActive: true })
    .sort({ displayOrder: 1, price: 1 });
};

module.exports = mongoose.model('Service', serviceSchema);