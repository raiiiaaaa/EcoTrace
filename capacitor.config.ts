import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ecotrace.app',
  appName: 'EcoTrace',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,        // Durasi tampil (ms)
      launchAutoHide: true,            // Auto hilang
      backgroundColor: "#1a1a2e",      // Warna background splash
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
