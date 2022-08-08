import {
    platform,
    registerCb,
    webToNativeIos,
  } from "../utills";
  /**
   * This function handles native facebook login
   * @param {object} options
   * @example wtn.backgroundLocation.start({
   *  callback:(data)=>{
   *    console.log(data);
   *  },
   *  data : { myKey : 1}
   * });
   */
  export const start =  (options) => {
    if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
      const { callback, data } = options;
  
      registerCb((response) => {
        const { type } = response;
        if (type === "backgroundLocationUpdate") {
          callback && callback(response);
        }
      });

  
      platform === "IOS_APP" &&
        webToNativeIos.postMessage({
          action: "startLocation",
          data
        });
    }
  };
  
  
  /**
   * This function handles native facebook logout
   * @param {object} options
   * @example wtn.backgroundLocation.stop();
   * 
   */
  export const stop = (options) => {
    if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
      
      platform === "IOS_APP" &&
        webToNativeIos.postMessage({
          action: "stopLocation",
        });
    }
  };