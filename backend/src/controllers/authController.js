const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { AppError } = require('../middleware/errorHandler');
const { sendSMS } = require('../services/smsService');
const { sendEmail } = require('../services/emailService');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Generate verification code
const generateVerificationCode = () => {
  // For testing purposes, return default code if set
  if (process.env.DEFAULT_VERIFICATION_CODE) {
    return process.env.DEFAULT_VERIFICATION_CODE;
  }
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Register new user
const register = async (req, res) => {
  // Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const {
    phoneNumber,
    email,
    password,
    firstName,
    lastName,
    preferredLanguage = 'en',
    referralCode
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this phone number already exists'
      });
    }

    // Check if email exists (if provided)
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
    }

    // Handle referral code
    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
      if (!referrer) {
        return res.status(400).json({
          success: false,
          message: 'Invalid referral code'
        });
      }
      referredBy = referrer._id;
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = await User.create({
      phoneNumber,
      email,
      password,
      firstName,
      lastName,
      preferredLanguage,
      referredBy,
      verificationCode,
      verificationCodeExpiry
    });

    // Send verification SMS
    try {
      await sendSMS(phoneNumber, `Your Cleanic verification code is: ${verificationCode}. Valid for 10 minutes.`);
    } catch (error) {
      console.error('SMS sending failed:', error);
      // Continue with registration even if SMS fails
    }

    // Create welcome notification
    await Notification.create({
      user: user._id,
      type: 'system_message',
      title: 'Welcome to Cleanic!',
      message: 'Thank you for joining Cleanic. Please verify your phone number to get started.',
      priority: 'high'
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your phone number.',
      data: {
        user: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          preferredLanguage: user.preferredLanguage,
          isVerified: user.isVerified,
          referralCode: user.referralCode
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    throw new AppError('Registration failed', 500);
  }
};

// Login user
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { phoneNumber, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(401).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Check if account is active
    if (user.accountStatus !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active. Please contact support.'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          preferredLanguage: user.preferredLanguage,
          isVerified: user.isVerified,
          role: user.role,
          referralCode: user.referralCode,
          ecoPoints: user.ecoPoints,
          totalOrders: user.totalOrders,
          totalSpent: user.totalSpent
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    throw new AppError('Login failed', 500);
  }
};

// Verify phone number
const verifyPhone = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { phoneNumber, verificationCode } = req.body;

  try {
    // Find user
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is already verified'
      });
    }

    // Check verification code
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Check if code is expired
    if (new Date() > user.verificationCodeExpiry) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired'
      });
    }

    // Verify user
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save();

    // Handle referral bonus
    if (user.referredBy) {
      const referrer = await User.findById(user.referredBy);
      if (referrer) {
        const referralBonus = 180; // R180 per referral
        
        // Check monthly limit
        if (referrer.referralEarningsThisMonth + referralBonus <= 900) {
          referrer.referralEarnings += referralBonus;
          referrer.referralEarningsThisMonth += referralBonus;
          referrer.referrals.push({
            user: user._id,
            earnings: referralBonus
          });
          await referrer.save();

          // Create referral notification
          await Notification.createReferralNotification(
            referrer._id,
            referralBonus,
            user.firstName
          );
        }
      }
    }

    // Create verification success notification
    await Notification.create({
      user: user._id,
      type: 'system_message',
      title: 'Phone Verified!',
      message: 'Your phone number has been successfully verified. Welcome to Cleanic!',
      priority: 'medium'
    });

    res.json({
      success: true,
      message: 'Phone number verified successfully',
      data: {
        user: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified
        }
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    throw new AppError('Verification failed', 500);
  }
};

// Resend verification code
const resendVerificationCode = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { phoneNumber } = req.body;

  try {
    // Find user
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is already verified'
      });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user
    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = verificationCodeExpiry;
    await user.save();

    // Send verification SMS
    try {
      await sendSMS(phoneNumber, `Your Cleanic verification code is: ${verificationCode}. Valid for 10 minutes.`);
    } catch (error) {
      console.error('SMS sending failed:', error);
      throw new AppError('Failed to send verification code', 500);
    }

    res.json({
      success: true,
      message: 'Verification code sent successfully'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    throw new AppError('Failed to resend verification code', 500);
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token is required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.accountStatus !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    const newToken = generateToken(user._id);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken
      }
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Logout
const logout = async (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // But we can log the logout event
  console.log(`User ${req.user._id} logged out at ${new Date()}`);

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

// Forgot password
const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { phoneNumber } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate reset code
    const resetCode = generateVerificationCode();
    const resetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.verificationCode = resetCode;
    user.verificationCodeExpiry = resetCodeExpiry;
    await user.save();

    // Send reset SMS
    try {
      await sendSMS(phoneNumber, `Your Cleanic password reset code is: ${resetCode}. Valid for 10 minutes.`);
    } catch (error) {
      console.error('SMS sending failed:', error);
      throw new AppError('Failed to send reset code', 500);
    }

    res.json({
      success: true,
      message: 'Password reset code sent successfully'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    throw new AppError('Failed to process forgot password request', 500);
  }
};

// Reset password
const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { phoneNumber, verificationCode, newPassword } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check verification code
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Check if code is expired
    if (new Date() > user.verificationCodeExpiry) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired'
      });
    }

    // Update password
    user.password = newPassword;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    throw new AppError('Failed to reset password', 500);
  }
};

// Change password
const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    throw new AppError('Failed to change password', 500);
  }
};

module.exports = {
  register,
  login,
  verifyPhone,
  resendVerificationCode,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword
};