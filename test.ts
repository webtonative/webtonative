// Simple test file to verify TypeScript support

import webtonative from './client';
import { StatusBarOptions } from './src/types';

// Test TypeScript type checking
const wtn = webtonative;

// Test with typed parameters
const statusBarOptions: StatusBarOptions = {
  color: '#FFFFFF',
  style: 'light'
};

// Call methods with type checking
wtn.statusBar(statusBarOptions);
wtn.hideSplashScreen();

// Test promise-based API with types
wtn.deviceInfo().then(info => {
  console.log('Device info:', info);
}).catch(error => {
  console.error('Error:', error);
});

// Test barcode scanning with typed parameters
wtn.Barcode.BarcodeScan({
  onBarcodeSearch: (value: string) => {
    console.log('Barcode value:', value);
  },
  format: wtn.Barcode.Format.QR_CODE
});

console.log('TypeScript test completed');