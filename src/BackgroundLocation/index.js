import {
    platform,
    webToNative,
    webToNativeIos,
    registerCb,
    deRegisterCbByKey
  } from "../utills";
  /**
   * 
   * 
   */
  export const start =  (options={}) => {
    if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
      const {data,callback} = options


      
      registerCb((response) => {
        const { type } = response;
        if (type === "LOCATION_UPDATE") {
          callback && callback(response);
        }
      },{
        key : 'LOCATION_UPDATE',
        ignoreDelete : true
      });

      platform === "IOS_APP" &&
        webToNativeIos.postMessage({
          action: "startLocation",
          data
        });
    }
  };
  
  
  /**
   * 
   * 
   */
   export const stop =  (options={}) => {
    if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
  
      deRegisterCbByKey('LOCATION_UPDATE')

      platform === "IOS_APP" &&
        webToNativeIos.postMessage({
          action: "stopLocation",
          
        });
    }
  };