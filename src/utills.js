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
  : "";
const isNativeApp = isClient && platform !== "";
const cbObj = {};
let counter = 1;
if (isNativeApp) {
  webToNative.androidCBHook = (results) => {
    console.log(results);
    alert(results);
    const responseObj = JSON.parse(results);
    const { type } = responseObj;
    for (var key in cbObj) {
      cbObj[key].cb(responseObj);
      delete cbObj[key];
    }
  };
  window.iosCBHook = (results) => {
    console.log(results);
    alert(results);
  };
}

const registerCb = (cb) => {
  if (typeof cb === "function") {
    cbObj[counter] = { cb };
    counter += 1;
  }
};
export {
  webToNative,
  isClient,
  isNativeApp,
  platform,
  registerCb,
  webToNativeIos,
};
