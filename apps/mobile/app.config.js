export default {
  expo: {
    name: 'EcommerceEarn',
    slug: 'ecommerceearn-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon-new.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash-new.jpg',
      backgroundColor: '#6366f1',
      resizeMode: 'contain',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.ecommerceearn.app',
      infoPlist: {
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
        },
      },
    },
    android: {
      package: 'com.ecommerceearn.app',
      usesCleartextTraffic: true,
    },
    scheme: 'ecommerceearn',
    plugins: [
      'expo-router',
      [
        'expo-image-picker',
        {
          photosPermission: "The app accesses your photos to let you share them with your friends.",
          cameraPermission: "The app accesses your camera to let you take photos."
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://3.208.16.32',
      eas: {
        projectId: "027676fe-d483-4386-9821-9e5962de72c1"
      }
    },
  },
};
