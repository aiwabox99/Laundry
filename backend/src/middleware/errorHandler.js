const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      statusCode: 404,
      message: message
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    let message = 'Duplicate field value entered';
    
    // Extract field name from error
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    
    switch (field) {
      case 'phoneNumber':
        message = 'Phone number already exists';
        break;
      case 'email':
        message = 'Email address already exists';
        break;
      case 'referralCode':
        message = 'Referral code already exists';
        break;
      case 'employeeId':
        message = 'Employee ID already exists';
        break;
      case 'orderNumber':
        message = 'Order number already exists';
        break;
      case 'trackingId':
        message = 'Tracking ID already exists';
        break;
      default:
        message = `${field} already exists`;
    }
    
    error = {
      statusCode: 400,
      message: message,
      field: field,
      value: value
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    const fields = Object.keys(err.errors);
    
    error = {
      statusCode: 400,
      message: message,
      fields: fields
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      statusCode: 401,
      message: 'Invalid token'
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      statusCode: 401,
      message: 'Token expired'
    };
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      statusCode: 400,
      message: 'File too large'
    };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = {
      statusCode: 400,
      message: 'Unexpected file field'
    };
  }

  // MongoDB connection errors
  if (err.name === 'MongoNetworkError') {
    error = {
      statusCode: 503,
      message: 'Database connection error'
    };
  }

  if (err.name === 'MongoTimeoutError') {
    error = {
      statusCode: 503,
      message: 'Database timeout error'
    };
  }

  // Rate limiting errors
  if (err.statusCode === 429) {
    error = {
      statusCode: 429,
      message: 'Too many requests, please try again later'
    };
  }

  // Custom application errors
  if (err.name === 'AppError') {
    error = {
      statusCode: err.statusCode || 400,
      message: err.message
    };
  }

  // Payment errors
  if (err.name === 'PaymentError') {
    error = {
      statusCode: 402,
      message: err.message || 'Payment processing failed'
    };
  }

  // SMS/Email service errors
  if (err.name === 'ServiceError') {
    error = {
      statusCode: 503,
      message: err.message || 'External service unavailable'
    };
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';

  // Build error response
  const errorResponse = {
    success: false,
    error: {
      message: message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        name: err.name,
        ...(error.fields && { fields: error.fields }),
        ...(error.field && { field: error.field }),
        ...(error.value && { value: error.value })
      })
    }
  };

  // Add additional error details in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.details = {
      originalError: err.message,
      statusCode: statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };
  }

  // Log error details
  console.error(`Error ${statusCode}: ${message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack:', err.stack);
  }

  res.status(statusCode).json(errorResponse);
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Custom payment error class
class PaymentError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Custom service error class
class ServiceError extends Error {
  constructor(message, service) {
    super(message);
    this.name = 'ServiceError';
    this.service = service;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

module.exports = {
  errorHandler,
  AppError,
  PaymentError,
  ServiceError,
  asyncHandler,
  notFound
};