import {
    platform,
    webToNative,
    webToNativeIos,
  } from "../utills";
  /**
   * 
   * @example 
   */
  export const setCollection =  (options) => {
    if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
      const {enabled} = options
  
      platform === "IOS_APP" &&
        webToNativeIos.postMessage({
          action: "setFirebaseAnalyticsCollection",
          enabled
        });
    }
  };
  
  
  /**
   * 
   * @example wtn.appsflyer.setCustomerUserId("ADD_TO_CART",{name:"Cadburry",quantity:1});
   */
  export const setUserId = (options) => {
    if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
      const { userId } = options
      
      
  
      platform === "IOS_APP" &&
        webToNativeIos.postMessage({
          action: "setFirebaseUserId",
          userId
        });
    }
  };


  export const setUserProperty = (options) => {
    if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
      const {key, value} = options
      
      
  
      platform === "IOS_APP" &&
        webToNativeIos.postMessage({
          action: "setFirebaseUserProp",
          key,
          value
        });
    }
  };

  export const setDefaultEventParameters = (options) => {
    if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
      const { parameters } = options
      
      
  
      platform === "IOS_APP" &&
        webToNativeIos.postMessage({
          action: "setFirebaseDefaultParam",
          parameters
        });
    }
  };

  export const logEvent = (options) => {
    if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
      const {eventName,parameters} = options
      
      
  
      platform === "IOS_APP" &&
        webToNativeIos.postMessage({
          action: "logFirebaseEvent",
          eventName,
          parameters
        });
    }
  };


  export const logScreen = (options) => {
    if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
      const {screenName,screenClass} = options
      
      
  
      platform === "IOS_APP" &&
        webToNativeIos.postMessage({
          action: "logFirebaseScreenView",
          screenName,
          screenClass
        });
    }
  };