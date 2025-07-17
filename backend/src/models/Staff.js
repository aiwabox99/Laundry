const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  // Basic Information
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
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\+27\d{9}$/.test(v);
      },
      message: 'Please enter a valid South African phone number'
    }
  },
  
  // Profile
  profileImage: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  
  // Employment Details
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  position: {
    type: String,
    enum: ['cleaner', 'driver', 'supervisor', 'manager'],
    required: true
  },
  department: {
    type: String,
    enum: ['laundry', 'delivery', 'customer_service', 'management'],
    required: true
  },
  hireDate: {
    type: Date,
    required: true
  },
  
  // Skills and Certifications
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    },
    certifiedDate: Date
  }],
  certifications: [{
    name: String,
    issuedBy: String,
    issuedDate: Date,
    expiryDate: Date,
    certificateUrl: String
  }],
  
  // Experience
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0
  },
  previousExperience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  
  // Availability
  isActive: {
    type: Boolean,
    default: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  workingHours: {
    monday: { start: String, end: String, isWorking: Boolean },
    tuesday: { start: String, end: String, isWorking: Boolean },
    wednesday: { start: String, end: String, isWorking: Boolean },
    thursday: { start: String, end: String, isWorking: Boolean },
    friday: { start: String, end: String, isWorking: Boolean },
    saturday: { start: String, end: String, isWorking: Boolean },
    sunday: { start: String, end: String, isWorking: Boolean }
  },
  
  // Location
  address: {
    street: String,
    city: String,
    province: String,
    postalCode: String,
    country: { type: String, default: 'South Africa' }
  },
  workingAreas: [{
    name: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    radius: Number // in kilometers
  }],
  
  // Performance Metrics
  rating: {
    type: Number,
    default: 5.0,
    min: 1,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  ratingSum: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  completedOrders: {
    type: Number,
    default: 0
  },
  cancelledOrders: {
    type: Number,
    default: 0
  },
  
  // Reviews
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Specializations
  specializations: [{
    type: String,
    enum: ['delicate_fabrics', 'stain_removal', 'eco_friendly', 'express_service', 'bulk_orders']
  }],
  
  // Languages
  languages: [{
    language: {
      type: String,
      enum: ['en', 'af', 'zu', 'xh']
    },
    proficiency: {
      type: String,
      enum: ['basic', 'intermediate', 'fluent', 'native'],
      default: 'intermediate'
    }
  }],
  
  // Emergency Contact
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String,
    email: String
  },
  
  // Banking Details (for payroll)
  bankingDetails: {
    accountHolder: String,
    bankName: String,
    accountNumber: String,
    branchCode: String,
    accountType: {
      type: String,
      enum: ['savings', 'cheque'],
      default: 'savings'
    }
  },
  
  // Employment Status
  employmentStatus: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'terminated'],
    default: 'active'
  },
  contractType: {
    type: String,
    enum: ['full_time', 'part_time', 'contract', 'temporary'],
    default: 'full_time'
  },
  
  // Salary Information
  salary: {
    amount: Number,
    currency: { type: String, default: 'ZAR' },
    frequency: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly'],
      default: 'monthly'
    }
  },
  
  // Performance Tracking
  performanceMetrics: {
    punctuality: { type: Number, default: 5, min: 1, max: 5 },
    quality: { type: Number, default: 5, min: 1, max: 5 },
    communication: { type: Number, default: 5, min: 1, max: 5 },
    efficiency: { type: Number, default: 5, min: 1, max: 5 }
  },
  
  // Notifications
  notificationPreferences: {
    sms: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true }
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

// Indexes
staffSchema.index({ employeeId: 1 });
staffSchema.index({ email: 1 });
staffSchema.index({ phoneNumber: 1 });
staffSchema.index({ isActive: 1, isAvailable: 1 });
staffSchema.index({ rating: -1 });
staffSchema.index({ position: 1, department: 1 });

// Virtual for full name
staffSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for completion rate
staffSchema.virtual('completionRate').get(function() {
  if (this.totalOrders === 0) return 100;
  return ((this.completedOrders / this.totalOrders) * 100).toFixed(1);
});

// Virtual for overall performance score
staffSchema.virtual('performanceScore').get(function() {
  const metrics = this.performanceMetrics;
  const average = (metrics.punctuality + metrics.quality + metrics.communication + metrics.efficiency) / 4;
  return Math.round(average * 10) / 10;
});

// Method to add rating
staffSchema.methods.addRating = function(rating) {
  this.totalRatings += 1;
  this.ratingSum += rating;
  this.rating = Math.round((this.ratingSum / this.totalRatings) * 10) / 10;
  return this.save();
};

// Method to update order count
staffSchema.methods.updateOrderCount = function(status) {
  this.totalOrders += 1;
  if (status === 'completed') {
    this.completedOrders += 1;
  } else if (status === 'cancelled') {
    this.cancelledOrders += 1;
  }
  return this.save();
};

// Method to check availability
staffSchema.methods.isAvailableAt = function(date, time) {
  if (!this.isActive || !this.isAvailable) return false;
  
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'lowercase' });
  const workingDay = this.workingHours[dayOfWeek];
  
  if (!workingDay || !workingDay.isWorking) return false;
  
  const startTime = new Date(`1970-01-01T${workingDay.start}:00`);
  const endTime = new Date(`1970-01-01T${workingDay.end}:00`);
  const checkTime = new Date(`1970-01-01T${time}:00`);
  
  return checkTime >= startTime && checkTime <= endTime;
};

// Static method to get available staff
staffSchema.statics.getAvailableStaff = function(date, time) {
  return this.find({ isActive: true, isAvailable: true })
    .sort({ rating: -1, totalOrders: -1 });
};

// Static method to get top rated staff
staffSchema.statics.getTopRatedStaff = function(limit = 10) {
  return this.find({ isActive: true, totalRatings: { $gte: 5 } })
    .sort({ rating: -1, totalRatings: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Staff', staffSchema);