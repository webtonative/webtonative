// Type definitions for webtonative

import { Platform, StatusBarOptions, DownloadBlobFileOptions, CustomFileDownloadOptions } from './src/types';

// Export platform constants
export const isAndroidApp: boolean;
export const isIosApp: boolean;

// Export core functions
export function hideSplashScreen(): void;
export function statusBar(options: StatusBarOptions): void;
export function downloadFile(downloadUrl: string): void;
export function downloadBlobFile(options: DownloadBlobFileOptions): void;
export function customFileDownload(options: CustomFileDownloadOptions): void;
export function deviceInfo(): Promise<any>;
export function showInAppReview(): void;

// Barcode module
export namespace Barcode {
  enum Format {
    ALL_FORMATS = 0,
    CODE_128 = 1,
    CODE_39 = 2,
    CODE_93 = 4,
    CODABAR = 8,
    DATA_MATRIX = 16,
    EAN_13 = 32,
    EAN_8 = 64,
    ITF = 128,
    QR_CODE = 256,
    UPC_A = 512,
    UPC_E = 1024,
    PDF417 = 2048,
    AZTEC = 4096
  }

  enum Types {
    QR_CODE = 'QR_CODE',
    DATA_MATRIX = 'DATA_MATRIX',
    UPC_E = 'UPC_E',
    UPC_A = 'UPC_A',
    EAN_8 = 'EAN_8',
    EAN_13 = 'EAN_13',
    CODE_128 = 'CODE_128',
    CODE_39 = 'CODE_39',
    CODE_93 = 'CODE_93',
    CODABAR = 'CODABAR',
    ITF = 'ITF',
    AZTEC = 'AZTEC',
    PDF_417 = 'PDF_417'
  }

  interface BarcodeScanOptions {
    onBarcodeSearch?: (value: string) => void;
    format?: number;
  }

  function BarcodeScan(options: BarcodeScanOptions): void;
}

// Define the main module
declare module 'webtonative' {
  export * from './src/index';
  export default function webtonative(): typeof import('./src/index');
}