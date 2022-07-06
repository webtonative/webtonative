import {
    platform,
    registerCb,
    webToNativeIos,
  } from "../utills";
  /**
   * This function handles native in app purchase
   * @param {object} options
   * @example wtn.purchase({
   *  productId : 'productId'
   *  callback:(data)=>{
   *    console.log(data);
   *  }
   * });
   */
  export const purchase =  (options) => {
    if (["IOS_APP"].includes(platform)) {
      const { callback, productId } = options;
  
      registerCb((response) => {
        const { type } = response;
        if (type === "inAppPurchase") {
          callback && callback(response);
        }
      });
      platform === "IOS_APP" &&
        webToNativeIos.postMessage({
          action: "inAppPurchase",
          productId
        });
    }
  };