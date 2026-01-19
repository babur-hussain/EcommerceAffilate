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
    plugins: ['expo-router'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://3.208.16.32',
      eas: {
        projectId: "e0b5602c-a326-4d20-a711-e35985e3863c"
      }
    },
  },
};
