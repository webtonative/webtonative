import { platform, registerCb, webToNativeIos } from "../utills";
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
const inAppPurchase = (options) => {
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
				productId,
			});
	}
};

export default inAppPurchase;
