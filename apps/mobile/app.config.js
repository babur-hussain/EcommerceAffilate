export default {
  expo: {
    name: 'EcommerceEarn',
    slug: 'ecommerceearn-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    splash: {
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
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.29.240:4000',
    },
  },
};
