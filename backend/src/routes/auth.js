const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  verifyPhone,
  resendVerificationCode,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('phoneNumber')
    .matches(/^\+27\d{9}$/)
    .withMessage('Please provide a valid South African phone number (+27xxxxxxxxx)'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('preferredLanguage')
    .optional()
    .isIn(['en', 'af', 'zu', 'xh'])
    .withMessage('Language must be one of: en, af, zu, xh'),
  body('referralCode')
    .optional()
    .isLength({ min: 6, max: 12 })
    .withMessage('Invalid referral code format')
];

const loginValidation = [
  body('phoneNumber')
    .matches(/^\+27\d{9}$/)
    .withMessage('Please provide a valid South African phone number'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const verifyPhoneValidation = [
  body('phoneNumber')
    .matches(/^\+27\d{9}$/)
    .withMessage('Please provide a valid South African phone number'),
  body('verificationCode')
    .isLength({ min: 4, max: 6 })
    .withMessage('Verification code must be 4-6 characters')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

// Routes
router.post('/register', registerValidation, asyncHandler(register));
router.post('/login', loginValidation, asyncHandler(login));
router.post('/verify-phone', verifyPhoneValidation, asyncHandler(verifyPhone));
router.post('/resend-verification', 
  body('phoneNumber').matches(/^\+27\d{9}$/).withMessage('Valid phone number required'),
  asyncHandler(resendVerificationCode)
);
router.post('/refresh-token', asyncHandler(refreshToken));
router.post('/logout', authMiddleware, asyncHandler(logout));
router.post('/forgot-password',
  body('phoneNumber').matches(/^\+27\d{9}$/).withMessage('Valid phone number required'),
  asyncHandler(forgotPassword)
);
router.post('/reset-password',
  body('phoneNumber').matches(/^\+27\d{9}$/).withMessage('Valid phone number required'),
  body('verificationCode').isLength({ min: 4, max: 6 }).withMessage('Valid verification code required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  asyncHandler(resetPassword)
);
router.post('/change-password', authMiddleware, changePasswordValidation, asyncHandler(changePassword));

module.exports = router;