# Cleanic App - Comprehensive Laundry & Cleaning Service Platform

## Overview
The Cleanic App is a robust mobile application designed to streamline laundry and cleaning services in South Africa. Built with React Native for cross-platform mobile support and Node.js/Express for the backend, it offers multilingual support and advanced features for users, staff, and administrators.

## Investment & Financial Context
- **Initial Investment**: ZAR 600,000
- **Target Year 1 Revenue**: ZAR 1.8M
- **Target Profit Margin**: 100%
- **Revenue Streams**: Subscription plans (R249-R799/month) + Pay-as-you-go services (R45-R399)

## Technology Stack

### Frontend (React Native)
- **Framework**: React Native with TypeScript
- **Platform Support**: iOS and Android
- **Key Libraries**:
  - Axios for API requests
  - AsyncStorage for token management
  - NetInfo for offline detection
  - JWT for authentication

### Backend (Node.js/Express)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT tokens
- **SMS**: Verification codes

## Key Features

### 1. User Authentication & Language Support
- Phone number registration with SMS verification
- Multi-language support (English, Afrikaans, Zulu, Xhosa)
- JWT-based session management
- Persistent login with AsyncStorage

### 2. Service Offerings

#### Subscription Plans
- **Starter**: 30KG, R249/month
- **Pro**: 40KG, R299/month
- **Family**: 55KG, R399/month
- **Family Plus**: R499/month
- **Business**: 100KG, R799/month
- **Custom KG**: Contact Us

#### Pay-As-You-Go Services
- Shoe/Sneaker Cleaning: R45/pair
- Carpet Cleaning: R199/2m²
- Mattress Cleaning: R399/month

### 3. Staff Selection & Management
- User-selectable staff with profiles
- Real-time availability tracking
- Staff ratings and reviews
- Administrative performance monitoring

### 4. Eco-Friendly Options
- Eco-friendly cleaning methods
- Eco points system (1 point per use)
- Water savings tracking (10L per point)

### 5. Advanced Features
- **Express Delivery**: +R99 for 3-hour delivery
- **Offline Functionality**: Order queuing without internet
- **Real-time Tracking**: Order status updates
- **Referral Program**: R180 per referral (max R900/month)
- **Community Challenges**: Reward-based engagement
- **Promotions**: Time-sensitive discounts

## Project Structure

```
cleanic-app/
├── frontend/                 # React Native app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── screens/         # App screens
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types
│   │   └── localization/    # Multi-language support
│   ├── package.json
│   └── App.tsx
├── backend/                  # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   └── utils/           # Helper functions
│   ├── package.json
│   └── server.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- React Native CLI
- MongoDB
- Android Studio / Xcode for mobile development

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cleanic-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npx react-native run-android  # or run-ios
   ```

### Environment Variables
Create `.env` files in both frontend and backend directories with appropriate configuration.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - SMS verification

### Services
- `GET /api/services` - Get all services
- `GET /api/services/subscriptions` - Get subscription plans
- `GET /api/services/payasyougo` - Get pay-as-you-go services

### Staff
- `GET /api/staff` - Get available staff
- `GET /api/staff/:id` - Get staff details
- `POST /api/staff/:id/rate` - Rate staff member

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id/track` - Track order status

## Contributing
Please read our contributing guidelines before submitting pull requests.

## License
This project is licensed under the MIT License.

## Support
For support, contact our development team or use the in-app chat feature.
