import { isNativeApp, platform, webToNative, registerCb } from "../utills";
let successCb = null;
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
  if (isNativeApp && platform === "ANDROID_APP") {
    registerCb((response) => {
      const { type, value } = response;
      if (type === "BARCODE_SCAN") {
        successCb(value);
      }
    });
    const { onBarcodeSearch, formats = [] } = options;
    const barcodeOptions = {
      formats,
    };
    isNativeApp && webToNative.startScanner(JSON.stringify(barcodeOptions));
    if (typeof onBarcodeSearch === "function") {
      successCb = onBarcodeSearch;
    }
  }
};
