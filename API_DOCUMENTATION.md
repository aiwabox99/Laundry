# Cleanic API Documentation

## Overview
The Cleanic API provides comprehensive endpoints for managing a laundry and cleaning service platform. It supports user authentication, service management, staff selection, order processing, and more.

**Base URL**: `http://localhost:5000/api`

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "data": {...},
  "message": "Optional message",
  "error": {...} // Only present on errors
}
```

## Endpoints

### Authentication (`/api/auth`)

#### Register User
- **POST** `/api/auth/register`
- **Body**:
  ```json
  {
    "phoneNumber": "+27123456789",
    "firstName": "John",
    "lastName": "Doe",
    "password": "password123",
    "email": "john@example.com", // Optional
    "preferredLanguage": "en", // Optional: en, af, zu, xh
    "referralCode": "CLEAN123" // Optional
  }
  ```
- **Response**: User object with JWT token

#### Login
- **POST** `/api/auth/login`
- **Body**:
  ```json
  {
    "phoneNumber": "+27123456789",
    "password": "password123"
  }
  ```
- **Response**: User object with JWT token

#### Verify Phone Number
- **POST** `/api/auth/verify-phone`
- **Body**:
  ```json
  {
    "phoneNumber": "+27123456789",
    "verificationCode": "1234"
  }
  ```

#### Resend Verification Code
- **POST** `/api/auth/resend-verification`
- **Body**:
  ```json
  {
    "phoneNumber": "+27123456789"
  }
  ```

#### Forgot Password
- **POST** `/api/auth/forgot-password`
- **Body**:
  ```json
  {
    "phoneNumber": "+27123456789"
  }
  ```

#### Reset Password
- **POST** `/api/auth/reset-password`
- **Body**:
  ```json
  {
    "phoneNumber": "+27123456789",
    "verificationCode": "1234",
    "newPassword": "newpassword123"
  }
  ```

#### Change Password
- **POST** `/api/auth/change-password`
- **Auth**: Required
- **Body**:
  ```json
  {
    "currentPassword": "oldpassword",
    "newPassword": "newpassword123"
  }
  ```

### Services (`/api/services`)

#### Get All Services
- **GET** `/api/services`
- **Query Parameters**:
  - `category`: `subscription` or `payasyougo`
  - `type`: `laundry`, `shoe_cleaning`, `carpet_cleaning`, `mattress_cleaning`
  - `language`: `en`, `af`, `zu`, `xh`

#### Get Subscription Plans
- **GET** `/api/services/subscriptions`
- **Query Parameters**:
  - `language`: `en`, `af`, `zu`, `xh`

#### Get Pay-as-You-Go Services
- **GET** `/api/services/payasyougo`
- **Query Parameters**:
  - `language`: `en`, `af`, `zu`, `xh`

#### Get Service by ID
- **GET** `/api/services/:id`
- **Query Parameters**:
  - `language`: `en`, `af`, `zu`, `xh`

### Staff (`/api/staff`)

#### Get Available Staff
- **GET** `/api/staff`
- **Query Parameters**:
  - `date`: ISO date string
  - `time`: Time in HH:MM format
  - `specialization`: Staff specialization filter

#### Get Staff by ID
- **GET** `/api/staff/:id`

#### Get Top Rated Staff
- **GET** `/api/staff/top-rated`
- **Query Parameters**:
  - `limit`: Number of staff to return (default: 10)

### Orders (`/api/orders`)
*All order endpoints require authentication*

#### Get User Orders
- **GET** `/api/orders`
- **Auth**: Required
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 10)

#### Get Order by ID
- **GET** `/api/orders/:id`
- **Auth**: Required

#### Track Order
- **GET** `/api/orders/:id/track`
- **Auth**: Required
- **Response**: Order tracking information including status, location, and estimated delivery time

### Users (`/api/users`)
*All user endpoints require authentication*

#### Get User Profile
- **GET** `/api/users/profile`
- **Auth**: Required

### Promotions (`/api/promotions`)

#### Get Active Promotions
- **GET** `/api/promotions`

#### Validate Promotion Code
- **POST** `/api/promotions/validate`
- **Body**:
  ```json
  {
    "code": "CARPET10"
  }
  ```

### Notifications (`/api/notifications`)
*All notification endpoints require authentication*

#### Get User Notifications
- **GET** `/api/notifications`
- **Auth**: Required
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 20)

#### Get Unread Count
- **GET** `/api/notifications/unread-count`
- **Auth**: Required

#### Mark Notification as Read
- **PUT** `/api/notifications/:id/read`
- **Auth**: Required

#### Mark All Notifications as Read
- **PUT** `/api/notifications/mark-all-read`
- **Auth**: Required

### Analytics (`/api/analytics`)
*All analytics endpoints require authentication*

#### Get User Analytics
- **GET** `/api/analytics/user`
- **Auth**: Required
- **Response**: User statistics including total orders, spending, eco points, and water saved

## Error Codes

- `400` - Bad Request (validation errors, missing fields)
- `401` - Unauthorized (invalid/missing token, account locked)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

## Status Codes

### Order Status
- `pending` - Order created, awaiting confirmation
- `confirmed` - Order confirmed, awaiting pickup
- `picked_up` - Items picked up, in transit to facility
- `in_progress` - Items being processed
- `ready_for_delivery` - Items ready for delivery
- `in_transit` - Items being delivered
- `delivered` - Items delivered to customer
- `completed` - Order completed
- `cancelled` - Order cancelled

### Payment Status
- `pending` - Payment not yet processed
- `paid` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded
- `partial` - Partial payment

## Multi-language Support

The API supports 4 languages:
- `en` - English (default)
- `af` - Afrikaans
- `zu` - Zulu
- `xh` - Xhosa

Pass the `language` query parameter to get localized content where available.

## Rate Limiting

API requests are rate-limited to prevent abuse:
- 100 requests per 15-minute window per IP address
- Authentication endpoints have stricter limits

## Development Notes

### Default Verification Code
In development mode, the default verification code is `1234` for testing purposes.

### SMS and Email Services
- SMS notifications require Twilio configuration
- Email notifications require SMTP configuration
- Both services fall back to console logging in development mode

### Database Seeding
Use `npm run seed` to populate the database with sample data for development.

## Examples

### Complete Registration Flow
```javascript
// 1. Register user
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '+27123456789',
    firstName: 'John',
    lastName: 'Doe',
    password: 'password123',
    email: 'john@example.com'
  })
});

// 2. Verify phone number
const verifyResponse = await fetch('/api/auth/verify-phone', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '+27123456789',
    verificationCode: '1234'
  })
});

// 3. Use token for authenticated requests
const token = registerResponse.data.token;
const profileResponse = await fetch('/api/users/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Get Services with Localization
```javascript
const services = await fetch('/api/services?language=af');
// Returns services with Afrikaans names and descriptions
```

### Track Order
```javascript
const tracking = await fetch('/api/orders/123/track', {
  headers: { 'Authorization': `Bearer ${token}` }
});
// Returns order status, location, and estimated delivery time
```

## Support

For API support or questions, contact the development team or refer to the main README.md file for setup instructions.