import {
    platform,
    webToNative,
    webToNativeIos,
  } from "../utills";
  /**
   * 
   * 
   */
  export const hide =  () => {
    if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
  
      platform === "IOS_APP" &&
        webToNativeIos.postMessage({
          action: "showHideStickyFooter",
          show:false
        });
    }
  };
  
  
  /**
   * 
   * 
   */
   export const show =  (options={}) => {
    const {key} = options
    if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
  
      platform === "IOS_APP" &&
        webToNativeIos.postMessage({
          action: "showHideStickyFooter",
          show:true,
          key
        });
    }
  };