# Cleanic Mobile App

A beautiful React Native mobile application for the Cleanic laundry service platform.

## Features

### 🎨 Beautiful UI/UX
- Modern design with gradient backgrounds and smooth animations
- Consistent theme and typography throughout the app
- Responsive design that works on all screen sizes
- Smooth transitions and micro-interactions

### 🔐 Authentication
- Phone number registration with SMS verification
- Multi-language support (English, Afrikaans, Zulu, Xhosa)
- Secure authentication with form validation
- Auto-formatting for South African phone numbers (+27)

### 🏠 Home Dashboard
- Personalized greeting and user stats
- Quick actions for common services
- Eco-points tracking and water savings
- Promotional offers and special deals
- Subscription status overview

### 🧹 Services
- **Subscription Plans**: 5 different plans from Starter (R249) to Business (R799)
- **Pay-as-you-go**: Shoe cleaning, carpet cleaning, mattress cleaning
- **Staff Selection**: Choose from rated professionals with specializations
- Interactive service cards with detailed information

### 🌟 Key Features
- **Eco-Points System**: Earn points for eco-friendly services
- **Staff Ratings**: 4.6-4.9 star rated professionals
- **Multi-language Support**: 4 South African languages
- **Express Delivery**: 3-hour delivery option
- **Offline Support**: Queue orders without internet
- **Promotional Codes**: WELCOME50, CARPET10

## Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **TypeScript**: Type-safe JavaScript
- **React Native Animatable**: Beautiful animations
- **Expo Linear Gradient**: Gradient backgrounds
- **AsyncStorage**: Local data persistence
- **Expo Vector Icons**: Comprehensive icon library

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on device**:
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or use `npm run android` / `npm run ios`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Gradient button with animations
│   ├── Card.tsx        # Animated card component
│   ├── Input.tsx       # Styled input with validation
│   └── index.ts        # Component exports
├── constants/          # App constants
│   └── theme.ts        # Colors, typography, spacing
├── screens/            # App screens
│   ├── WelcomeScreen.tsx    # Onboarding flow
│   ├── AuthScreen.tsx       # Login/Register
│   ├── HomeScreen.tsx       # Main dashboard
│   └── ServicesScreen.tsx   # Services & staff
└── navigation/         # Navigation setup (future)
```

## Design System

### Colors
- **Primary**: Blue (#2196F3) - Trust and reliability
- **Secondary**: Green (#4CAF50) - Eco-friendly theme
- **Accent**: Orange (#FF9800) - Call-to-action
- **Success**: Green for confirmations
- **Error**: Red for validation errors

### Typography
- **Headlines**: Bold, clear hierarchy
- **Body Text**: Readable, consistent spacing
- **Captions**: Subtle, informative

### Components
- **Buttons**: 4 variants (primary, secondary, outline, ghost)
- **Cards**: Animated with shadows and rounded corners
- **Inputs**: Validation states with smooth transitions

## Screens Overview

### 1. Welcome Screen
- 3-slide onboarding flow
- Feature highlights with icons
- Smooth horizontal scrolling
- Trust indicators (Safe, 24/7, 5-star)

### 2. Authentication Screen
- Phone number registration
- SMS verification (demo code: any 6 digits)
- Multi-language selector
- Form validation with animations

### 3. Home Screen
- Personalized dashboard
- Quick action grid
- Service overview cards
- Promotional banners
- Subscription status
- Floating action button

### 4. Services Screen
- Tabbed interface (Subscriptions, Pay-as-you-go, Staff)
- Detailed service cards
- Staff profiles with ratings
- Interactive selection states

## Development Notes

### State Management
- Uses React hooks for local state
- AsyncStorage for persistence
- Simple navigation state machine

### Animations
- Entrance animations for cards
- Smooth transitions between screens
- Micro-interactions for buttons
- Loading states with spinners

### Responsive Design
- Flexible layouts using Flexbox
- Percentage-based widths
- Scalable typography
- Touch-friendly button sizes

## Future Enhancements

1. **Navigation**: Implement React Navigation for better routing
2. **API Integration**: Connect to backend services
3. **Push Notifications**: Order updates and promotions
4. **Payment Integration**: PayFast payment gateway
5. **Order Tracking**: Real-time order status
6. **Chat Support**: In-app customer support
7. **Offline Mode**: Enhanced offline capabilities
8. **Performance**: Code splitting and lazy loading

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for type safety
3. Add animations for new components
4. Test on both iOS and Android
5. Update this README for new features

## License

Private - Cleanic App Development Project

---

**Built with ❤️ for the South African laundry industry**