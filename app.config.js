export default {
  expo: {
    name: 'sratrc',
    scheme: 'sratrc',
    slug: 'sratrc',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      package: 'com.vandit.sratrc',
      bundleIdentifier: 'com.vandit.sratrc',
      googleServicesFile: process.env.GOOGLE_SERVICES_PLIST,
      infoPlist: {
        LSApplicationQueriesSchemes: ['tez', 'phonepe', 'paytmmp']
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.vandit.sratrc',
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      intentFilters: [
        {
          action: 'VIEW',
          data: [
            {
              scheme: 'sratrc'
            }
          ],
          category: ['BROWSABLE', 'DEFAULT']
        }
      ]
    },
    web: {
      favicon: './assets/favicon.png'
    },
    // updates: {
    //   enabled: true,
    //   checkAutomatically: 'ON_LOAD',
    //   fallbackToCacheTimeout: 0
    // },
    plugins: [
      'expo-router',
      '@react-native-firebase/app',
      [
        'expo-build-properties',
        {
          android: {
            minSdkVersion: 26,
            enableProguardInReleaseBuilds: true
          },
          ios: {
            useFrameworks: 'static'
          }
        }
      ],
      [
        '@sentry/react-native/expo',
        {
          url: 'https://sentry.io/',
          project: 'react-native',
          organization: 'vendz'
        }
      ],
      [
        'expo-camera',
        {
          cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera'
        }
      ],
      [
        'expo-notifications',
        {
          icon: './assets/images/logo.png',
          // "color": "#ffffff",
          // "defaultChannel": "default",
          enableBackgroundRemoteNotifications: true
        }
      ]
    ],
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: 'dd738b1d-693a-4caf-a896-60f252dc2d40'
      }
    },
    owner: 'vendz'
  }
};
