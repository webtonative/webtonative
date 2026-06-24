import {
  isNativeApp,
  platform,
  webToNative,
  registerCb,
  webToNativeIos,
} from "../utills";
import Format from "./formats";

// Define interfaces for barcode scanner
interface BarcodeScanOptions {
  onBarcodeSearch?: (value: string) => void;
  format?: number;
  callback?: (response: BarcodeScanResponse) => void;
  multiScan?: boolean;
  maxCount?: number;
  allowDuplicates?: boolean;
}

interface BarcodeScanResponse {
  type: string;
  value: string;
  [key: string]: any;
}

/**
 * This function opens native barcode scanner from Android/Ios app.
 * @param {object} options
 * @example wtn.onScanner({
 *  onBarcodeSearch:(value)=>{
 *    console.log(value);
 *  }
 * });
 */
const BarcodeScan = (options: BarcodeScanOptions): void => {
  if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
    const { onBarcodeSearch, format, callback ,...rest} = options;

    registerCb((response: BarcodeScanResponse) => {
      const { type, value } = response;
      if (type === "BARCODE_SCAN") {
        onBarcodeSearch && onBarcodeSearch(value);
        callback && callback(response);
      }
    });
    
    if (platform === "ANDROID_APP" && webToNative.startScanner) {
      webToNative.startScanner(
        JSON.stringify({
          formats: format ? [format] : [],
          ...rest
        })
      );
    }
    
    if (platform === "IOS_APP" && webToNativeIos) {
      webToNativeIos.postMessage({
        action: "barcodeScan",
        formats: format ? [format] : [Format.ALL_FORMATS],
        ...rest
      });
    }
  }
};

export default BarcodeScan;