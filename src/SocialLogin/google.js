import {
  platform,
  registerCb,
  webToNativeIos,
} from "../utills";
/**
 * This function handles native facebook login
 * @param {object} options
 * @example wtn.socialLogin.facebook.login({
 *  callback:(data)=>{
 *    console.log(data);
 *  }
 * });
 */
export const login =  (options) => {
  if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
    const { callback, scope } = options;

    registerCb((response) => {
      const { type } = response;
      if (type === "googleLoginToken") {
        callback && callback(response);
      }
    });
    platform === "IOS_APP" &&
      webToNativeIos.postMessage({
        action: "googleSignIn",
        scope
      });
  }
};


/**
 * This function handles native google logout
 * @param {object} options
 * @example wtn.socialLogin.google.logout({
 *  callback:(data)=>{
 *    console.log(data);
 *  }
 * });
 */
export const logout = (options) => {
  if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
    const { callback, scope } = options;

    registerCb((response) => {
      const { type } = response;
      if (type === "googleLogOut") {
        callback && callback(response);
      }
    });
    platform === "IOS_APP" &&
      webToNativeIos.postMessage({
        action: "googleSignOut",
        scope
      });
  }
};