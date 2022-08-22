import {
    platform,
    webToNative,
    webToNativeIos,
  } from "../utills";
  /**
   * 
   * @example 
   */
  export const send =  (options) => {
    if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
      const {event,valueToSum,parameters} = options
  
      platform === "IOS_APP" &&
        webToNativeIos.postMessage({
          action: "sendFBEvent",
          eventName:event,
          valueToSum,
          parameters
        });
    }
  };
  
  
  /**
   * 
   * @example wtn.appsflyer.setCustomerUserId("ADD_TO_CART",{name:"Cadburry",quantity:1});
   */
  export const sendPurchase = (options) => {
    if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
      const {amount,currency,parameters} = options
      
  
      platform === "IOS_APP" &&
        webToNativeIos.postMessage({
          action: "sendFBPurchaseEvent",
          currency,
          amount,
          parameters
        });
    }
  };