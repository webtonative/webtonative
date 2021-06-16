/**
 * Repository for webtonative javascript sdk. Build your android/ios app from https://webtonative.com.
 * This is in beta phase.
 * @example npm install webtonative
 * import webtonative from "webtonative";
 * const wtn = webtonative();
 */
import { isNativeApp, webToNative, platform, webToNativeIos } from "./utills";
const isAndroidApp = platform === "ANDROID_APP";
const isIosApp = platform === "IOS_APP";

export default {
  isAndroidApp,
  isIosApp: platform === "IOS_APP",
  platform: platform,
  version: null,
  isNativeApp,
  statusBar: (options) => {},
  deviceInfo: () => {},
  /**
   * This function hides splash screen
   * @example wtn.hideSplashScreen()
   */
  hideSplashScreen: () => {
    isNativeApp && webToNative.hideSplashScreen();
  },
  showInAppReview: () => {
    isNativeApp && webToNative.showInAppReview();
  },
  shareLink: ({ url = "" }) => {
    if (url) {
      isAndroidApp && webToNative.openShareIntent(url);
      isIosApp &&
        webToNativeIos.postMessage({
          action: "share",
          url,
        });
    } else {
      throw "url is mandatory";
    }
  }
};