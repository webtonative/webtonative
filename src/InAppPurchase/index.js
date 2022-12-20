import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
/**
 * This function handles native in app purchase
 * @param {object} options
 * @example wtn.inAppPurchase({
 *  productId : 'productId'
 *  callback:(data)=>{
 *    console.log(data);
 *  }
 * });
 */
export const inAppPurchase = (options) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, productId, productType, isConsumable=false } = options;

		registerCb((response) => {
			const { type } = response;
			if (type === "inAppPurchase") {
				callback && callback(response);
			}
		});
		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "inAppPurchase",
				productId,
			});

		platform === "ANDROID_APP" &&
			webToNative.inAppPurchase(JSON.stringify({
				action: "inAppPurchase",
				productId,
				productType,
				isConsumable
			}))
	}
};

export const getAllPurchases = (options) => {
	if (["ANDROID_APP"].includes(platform)) {

		const { callback } = options;

		registerCb((response) => {
			const { type } = response;
			if (type === "purchaseList") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
			webToNative.getAllPurchases({
				action: "purchaseList"
			})
	}
}