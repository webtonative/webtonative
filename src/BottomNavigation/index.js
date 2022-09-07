import {
    platform,
    webToNative,
    webToNativeIos,
  } from "../utills";
  /**
   * 
   * 
   */
  export const hideTabs =  () => {
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
   export const showTabs =  (options={}) => {
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