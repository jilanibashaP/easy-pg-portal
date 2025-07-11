
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.8cb54e6f7fc64990a12121c8a1b70f43',
  appName: 'Easy PG Manager',
  webDir: 'dist',
  server: {
    url: 'https://8cb54e6f-7fc6-4990-a121-21c8a1b70f43.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
      keystorePassword: null,
      keystoreAliasPassword: null,
    }
  }
};

export default config;
