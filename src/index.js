/**
 * Repository for webtonative javascript sdk. Build your android/ios app from https://webtonative.com.
 * This is in beta phase.
 * @example npm install webtonative
 * import webtonative from "webtonative";
 * const wtn = webtonative();
 */
import { isNativeApp, webToNative, platform, webToNativeIos, registerCb } from "./utills";
export const isAndroidApp = platform === "ANDROID_APP";
export const isIosApp = platform === "IOS_APP";


/**
 * This function hides splash screen
 * @example wtn.hideSplashScreen()
 */
export const hideSplashScreen = () => {
  isNativeApp && webToNative.hideSplashScreen();
}

export const statusBar = (options) => {
  isNativeApp && webToNative.statusBar(JSON.stringify(options));
};

export const deviceInfo = () => {
  return new Promise((resolve, reject) => {
    registerCb((results) => {
      if (results) {
        resolve(results);
      } else {
        reject({
          err:"Error getting device info"
        });
      }
    },{
      key:"deviceInfo"
    });
    if (platform === "ANDROID_APP") {
      webToNative.getDeviceInfo();
    } else if (platform === "IOS_APP") {
      webToNativeIos.postMessage({
        action: "deviceInfo",
      });
    } else {
      reject("This function will work in Native App Powered By WebToNative");
    }
  });
};

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

export default {
  isAndroidApp,
  isIosApp,
  hideSplashScreen,
  statusBar,
  deviceInfo,
  showInAppReview,
  shareLink,
  platform,
  isNativeApp,
}