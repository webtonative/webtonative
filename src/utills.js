const isClient = typeof window !== "undefined";
const webToNative = (isClient && window.WebToNativeInterface) || {};
const webToNativeIos =
  isClient &&
  window.webkit &&
  window.webkit.messageHandlers &&
  window.webkit.messageHandlers.webToNativeInterface;
const platform = webToNative.getAndroidVersion
  ? "ANDROID_APP"
  : webToNativeIos
  ? "IOS_APP"
  : "WEBSITE";
const isNativeApp = isClient && platform !== "";
const cbObj = {};
let counter = 1;
let abMobCb = null;
if (isNativeApp) {
  webToNative.androidCBHook = (results) => {
    const responseObj = JSON.parse(results);
    const { type } = responseObj;
    for (var key in cbObj) {
      cbObj[key].cb(responseObj);
      delete cbObj[key];
    }
  };
  webToNative.androidAdMobCBHook = (results) => {
    const responseObj = JSON.parse(results);
    abMobCb && abMobCb(responseObj);
  };
  window.iosCBHook = (results) => {
    var response = results;
    try {
      response = JSON.parse(results);
    } catch (e) {}
    for (var key in cbObj) {
      cbObj[key].cb(response);
      delete cbObj[key];
    }
  };
}

const registerCb = (cb) => {
  if (typeof cb === "function") {
    cbObj[counter] = { cb };
    counter += 1;
  }
};
const registerForAbMobCb = (cb) => {
  if (typeof cb === "function") {
    abMobCb = cb;
  }
};
const deRegisterForAbMobCb = () => {
  if (abMobCb) {
    abMobCb = null;
  }
};
export {
  webToNative,
  isClient,
  isNativeApp,
  platform,
  registerCb,
  webToNativeIos,
  registerForAbMobCb,
  deRegisterForAbMobCb,
};
