# Quick Start Guide - EcommerceEarn Mobile App

## Prerequisites

1. **Node.js 18+** installed
2. **Expo CLI** (optional, but recommended):
   ```bash
   npm install -g expo-cli
   ```
3. **Expo Go App** on your phone:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Setup Steps

### 1. Install Dependencies

From the `apps/mobile` directory:
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in `apps/mobile/` (copy from `.env.example` if available):

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyCCq6s1VXf3C5QOib9ddv2EfuVAjoyHttk
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=affilate-ecommerce-56ccc.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=affilate-ecommerce-56ccc
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=affilate-ecommerce-56ccc.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=295518104458
EXPO_PUBLIC_FIREBASE_APP_ID=1:295518104458:web:ce593105ee2da6c32db673
EXPO_PUBLIC_API_URL=http://localhost:4000
```

### 3. Start the Backend Server

Make sure the backend is running on port 4000:
```bash
# From root directory
npm run backend

# Or from apps/backend
cd apps/backend
npm run dev
```

### 4. Start the Mobile App

From `apps/mobile`:
```bash
npm start
```

Or from root directory:
```bash
npm run mobile
```

### 5. Run on Device/Simulator

**Option A: Physical Device (Recommended for first-time setup)**
1. Open Expo Go app on your phone
2. Scan the QR code shown in the terminal
3. Wait for the app to load

**Option B: iOS Simulator**
```bash
npm run ios
```

**Option C: Android Emulator**
```bash
npm run android
```

## Testing the App

1. **Login Screen**: Navigate to the login screen
2. **Sign In**: Use your Firebase credentials
3. **Home Screen**: Browse featured products
4. **Products Tab**: Search and browse all products
5. **Product Details**: Tap any product to see details
6. **Profile Tab**: View your profile information

## Project Structure Overview

```
apps/mobile/
├── app/                      # Expo Router pages (file-based routing)
│   ├── (tabs)/              # Tab navigation group
│   │   ├── index.tsx        # Home screen
│   │   ├── products.tsx     # Products listing
│   │   ├── cart.tsx         # Shopping cart
│   │   └── profile.tsx      # User profile
│   ├── login.tsx            # Login screen
│   ├── product/[id].tsx     # Product detail (dynamic route)
│   └── _layout.tsx          # Root layout
├── src/
│   ├── lib/
│   │   ├── api.ts           # API client (axios)
│   │   └── firebase.ts      # Firebase configuration
│   └── context/
│       └── AuthContext.tsx  # Authentication context
├── assets/                   # Images, fonts, etc.
├── app.json                  # Expo configuration
├── package.json
└── tsconfig.json
```

## Common Commands

```bash
# Start development server
npm start

# Clear cache and restart
npx expo start --clear

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web

# Install new package
npm install <package-name>
```

## Troubleshooting

### Metro Bundler Issues
```bash
npx expo start --clear
```

### Build Errors
```bash
rm -rf node_modules
npm install
```

### Firebase Connection Issues
- Verify `.env` file exists and has correct values
- Check Firebase project settings
- Ensure backend API is running

### API Connection Issues
- Verify backend is running on port 4000
- Check `EXPO_PUBLIC_API_URL` in `.env`
- For physical device, use your computer's IP address instead of `localhost`

### For Physical Device Testing
If testing on a physical device, update the API URL to use your computer's IP:
```env
EXPO_PUBLIC_API_URL=http://192.168.1.X:4000
```

Find your IP:
- Windows: `ipconfig`
- Mac/Linux: `ifconfig` or `ip addr`

## Next Steps

1. ✅ App structure is set up
2. ✅ Firebase authentication configured
3. ✅ API integration ready
4. ✅ Basic screens implemented
5. 🔄 Add shopping cart functionality
6. 🔄 Implement order management
7. 🔄 Add payment integration
8. 🔄 Implement push notifications

## Development Tips

- Use Expo Go for quick testing on physical devices
- Hot reload is enabled by default
- Check console logs in terminal for debugging
- Use React Native Debugger for advanced debugging
- Test on both iOS and Android for compatibility

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
