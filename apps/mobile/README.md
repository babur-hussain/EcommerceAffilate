# EcommerceEarn Mobile App

React Native mobile application built with Expo for the EcommerceEarn platform.

## Features

- 🔐 Firebase Authentication (Email/Password)
- 🛍️ Product Browsing & Search
- 🛒 Shopping Cart (Coming Soon)
- 👤 User Profile Management
- 📱 Native iOS & Android Support
- 🎨 Modern UI with React Native

## Tech Stack

- **Expo SDK 52** - React Native framework
- **Expo Router** - File-based routing
- **Firebase** - Authentication
- **TypeScript** - Type safety
- **Axios** - API client
- **React Navigation** - Navigation

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (install globally: `npm install -g expo-cli`)
- Expo Go app on your phone (for testing)

### Installation

1. Install dependencies:
```bash
cd apps/mobile
npm install
```

2. Configure environment variables:
Create a `.env` file in `apps/mobile/`:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_API_URL=http://localhost:4000
```

3. Start the development server:
```bash
npm start
```

Or from the root directory:
```bash
npm run mobile
```

### Running on Devices

#### iOS Simulator
```bash
npm run ios
```

#### Android Emulator
```bash
npm run android
```

#### Physical Device
1. Install Expo Go app from App Store (iOS) or Play Store (Android)
2. Scan the QR code shown in the terminal
3. The app will load on your device

## Project Structure

```
apps/mobile/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen
│   │   ├── products.tsx  # Products listing
│   │   ├── cart.tsx       # Shopping cart
│   │   └── profile.tsx    # User profile
│   ├── login.tsx          # Login screen
│   └── product/[id].tsx   # Product details
├── src/
│   ├── lib/               # Utilities
│   │   ├── api.ts         # API client
│   │   └── firebase.ts    # Firebase config
│   └── context/           # React contexts
│       └── AuthContext.tsx
├── assets/                # Images, fonts, etc.
├── app.json               # Expo configuration
└── package.json
```

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser

## Backend Integration

The app connects to the backend API running on `http://localhost:4000` by default. Make sure the backend server is running before testing API features.

### API Endpoints Used

- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `GET /api/users/me` - Get current user profile
- `POST /api/auth/login` - User login (handled by Firebase)

## Authentication Flow

1. User signs in with email/password via Firebase
2. Firebase token is stored in AsyncStorage
3. Token is sent with API requests via axios interceptors
4. User profile is fetched from backend API

## Development Notes

- The app uses Expo Router for file-based routing
- Firebase authentication is configured for React Native
- API calls use axios with automatic token injection
- All screens are built with React Native components
- TypeScript is used throughout for type safety

## Future Enhancements

- [ ] Google Sign-In integration
- [ ] Shopping cart functionality
- [ ] Order management
- [ ] Push notifications
- [ ] Offline support
- [ ] Image caching
- [ ] Payment integration (Razorpay)
- [ ] Wishlist feature
- [ ] Product reviews and ratings

## Troubleshooting

### Metro bundler issues
```bash
npx expo start --clear
```

### Build errors
```bash
rm -rf node_modules
npm install
```

### Firebase connection issues
- Verify environment variables are set correctly
- Check Firebase project configuration
- Ensure backend API is running

## License

Private - EcommerceEarn Platform
