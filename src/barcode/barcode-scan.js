import {
  isNativeApp,
  platform,
  webToNative,
  registerCb,
  webToNativeIos,
} from "../utills";
let successCb = null;
import Format from "./formats";
/**
 * This function opens native barcode scanner from Android/Ios app.
 * @param {object} options
 * @example wtn.onScanner({
 *  onBarcodeSearch:(value)=>{
 *    console.log(value);
 *  }
 * });
 */
export default (options) => {
  if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
    const { onBarcodeSearch, format } = options;

    registerCb((response) => {
      const { type, value } = response;
      if (type === "BARCODE_SCAN") {
        onBarcodeSearch && onBarcodeSearch(value);
      }
    });
    platform === "ANDROID_APP" &&
      webToNative.startScanner(
        JSON.stringify({
          formats: format ? [format] : [],
        })
      );
    platform === "IOS_APP" &&
      webToNativeIos.postMessage({
        action: "barcodeScan",
        barcodeFormat: format ? String(format) : String(Format.ALL_FORMATS),
      });
  }
};
