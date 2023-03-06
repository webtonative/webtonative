import {
    platform,
    webToNative,
    webToNativeIos,
  } from "../utills";
  /**
   * 
   * @example wtn.appsflyer.setCustomerUserId("1234");
   */
  export const setCustomerUserId =  (userId) => {
    if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
      platform === "ANDROID_APP" &&
        webToNative.setAppsFlyerUserId(userId);
  
      platform === "IOS_APP" &&
        webToNativeIos.postMessage({
          action: "setAppsFlyerUserId",
          userId
        });
    }
  };
  
  
  /**
   * 
   * @example wtn.appsflyer.setCustomerUserId("ADD_TO_CART",{name:"Cadburry",quantity:1});
   */
  export const logEvent = (eventName,eventValues) => {
    if (["ANDROID_APP", "IOS_APP"].includes(platform)) {

      platform === "ANDROID_APP" &&
        webToNative.addEventToAppsFlyer(eventName,JSON.stringify(eventValues));
  
      platform === "IOS_APP" &&
        webToNativeIos.postMessage({
          action: "addEventToAppsFlyer",
          eventName,
          eventValues
        });
    }
  };