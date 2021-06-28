/**
 * Repository for webtonative javascript sdk. Build your android/ios app from https://webtonative.com.
 * This is in beta phase.
 * @example npm install webtonative
 * import webtonative from "webtonative";
 * const wtn = webtonative();
 */
import { isNativeApp, webToNative, platform, webToNativeIos } from "./utills";
export const isAndroidApp = platform === "ANDROID_APP";
export const isIosApp = platform === "IOS_APP";


/**
 * This function hides splash screen
 * @example wtn.hideSplashScreen()
 */
export const hideSplashScreen = () => {
  isNativeApp && webToNative.hideSplashScreen();
}

export const statusBar = (options) => {};

export const deviceInfo = () => {};

export const showInAppReview = () => {
  isNativeApp && webToNative.showInAppReview();
}

export const shareLink = ({ url = "" }) => {
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

export {
  platform,
  isNativeApp,
};