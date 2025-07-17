const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Authentication
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\+27\d{9}$/.test(v); // South African phone number format
      },
      message: 'Please enter a valid South African phone number (+27xxxxxxxxx)'
    }
  },
  email: {
    type: String,
    sparse: true, // Allows multiple null values
    validate: {
      validator: function(v) {
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String,
    default: null
  },
  verificationCodeExpiry: {
    type: Date,
    default: null
  },

  // Profile Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  profileImage: {
    type: String,
    default: null
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    default: null
  },

  // Preferences
  preferredLanguage: {
    type: String,
    enum: ['en', 'af', 'zu', 'xh'], // English, Afrikaans, Zulu, Xhosa
    default: 'en'
  },
  preferredCurrency: {
    type: String,
    default: 'ZAR'
  },
  notificationPreferences: {
    sms: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false }
  },

  // Address Information
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    street: String,
    city: String,
    province: String,
    postalCode: String,
    country: { type: String, default: 'South Africa' },
    isDefault: { type: Boolean, default: false },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  }],

  // Subscription Information
  activeSubscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    default: null
  },
  subscriptionHistory: [{
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription'
    },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'paused']
    }
  }],

  // Usage Tracking
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  ecoPoints: {
    type: Number,
    default: 0
  },
  waterSaved: {
    type: Number,
    default: 0 // in liters
  },
  kgUsedThisMonth: {
    type: Number,
    default: 0
  },
  kgRollover: {
    type: Number,
    default: 0,
    max: 30 // Maximum 30kg rollover
  },
  freeKgEarned: {
    type: Number,
    default: 0
  },

  // Referral System
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  referralEarnings: {
    type: Number,
    default: 0
  },
  referralEarningsThisMonth: {
    type: Number,
    default: 0
  },
  referrals: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    },
    earnings: {
      type: Number,
      default: 180 // R180 per referral
    }
  }],

  // Gamification
  level: {
    type: Number,
    default: 1
  },
  experience: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    description: String,
    earnedDate: {
      type: Date,
      default: Date.now
    },
    icon: String
  }],
  completedChallenges: [{
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    completedDate: {
      type: Date,
      default: Date.now
    },
    reward: {
      type: String,
      description: String
    }
  }],

  // Preferences & Settings
  preferredStaff: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }],
  blacklistedStaff: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }],
  preferredTimeSlots: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    startTime: String, // Format: "HH:MM"
    endTime: String    // Format: "HH:MM"
  }],

  // Account Status
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'deactivated', 'banned'],
    default: 'active'
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'staff', 'manager'],
    default: 'user'
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
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
userSchema.index({ phoneNumber: 1 });
userSchema.index({ email: 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'addresses.coordinates': '2dsphere' });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to generate referral code
userSchema.pre('save', function(next) {
  if (!this.referralCode && this.isNew) {
    this.referralCode = this.generateReferralCode();
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate referral code
userSchema.methods.generateReferralCode = function() {
  const prefix = 'CLEAN';
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${suffix}`;
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Method to add eco points
userSchema.methods.addEcoPoints = function(points) {
  this.ecoPoints += points;
  this.waterSaved += points * 10; // 10L per eco point
  return this.save();
};

// Method to update monthly usage
userSchema.methods.updateMonthlyUsage = function(kgUsed) {
  this.kgUsedThisMonth += kgUsed;
  return this.save();
};

// Method to check if user can earn free kg
userSchema.methods.checkFreeKgEligibility = function() {
  if (this.totalOrders > 0 && this.totalOrders % 10 === 0) {
    this.freeKgEarned += 5; // 5kg after every 10 orders
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to reset monthly counters (called by cron job)
userSchema.methods.resetMonthlyCounters = function() {
  this.referralEarningsThisMonth = 0;
  
  // Rollover unused kg (max 30kg)
  if (this.activeSubscription && this.kgUsedThisMonth < this.subscriptionKgLimit) {
    const unusedKg = this.subscriptionKgLimit - this.kgUsedThisMonth;
    this.kgRollover = Math.min(this.kgRollover + unusedKg, 30);
  }
  
  this.kgUsedThisMonth = 0;
  return this.save();
};

// Export model
module.exports = mongoose.model('User', userSchema);