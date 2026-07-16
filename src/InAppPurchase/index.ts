import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import {
	InAppPurchaseOptions,
	GetAllPurchasesOptions,
	GetReceiptDataOptions,
	InAppPurchaseResponse,
	InAppPurchaseIosMessage,
	InAppPurchaseAndroidParams
} from "./types";

/**
 * This function handles native in app purchase
 * @param options - Options for in-app purchase
 * @example wtn.inAppPurchase({
 *  productId : 'productId'
 *  callback:(data)=>{
 *    console.log(data);
 *  }
 * });
 */
export const inAppPurchase = (options: InAppPurchaseOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, productId, productType, isConsumable = false, accountToken } = options||{};

		registerCb((response: InAppPurchaseResponse) => {
			const { type } = response;
			if (type === "inAppPurchase") {
				callback && callback(response);
			}
		}, { key: "inAppPurchase" });

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "inAppPurchase",
				productId,
				accountToken
			} as InAppPurchaseIosMessage);
		}

		platform === "ANDROID_APP" &&
			webToNative.inAppPurchase(JSON.stringify({
				action: "inAppPurchase",
				productId,
				productType,
				isConsumable,
				accountToken
			} as InAppPurchaseAndroidParams));
	}
};

/**
 * Gets all purchases (Android only)
 * @param options - Options for getting all purchases
 */
export const getAllPurchases = (options: GetAllPurchasesOptions): void => {
	if (["ANDROID_APP"].includes(platform)) {
		const { callback } = options;

		registerCb((response: InAppPurchaseResponse) => {
			const { type } = response;
			if (type === "purchaseList") {
				callback && callback(response);
			}
		}, { key: "purchaseList" });

		platform === "ANDROID_APP" &&
			webToNative.getAllPurchases({
				action: "purchaseList"
			});
	}
};

/**
 * Gets receipt data (iOS only)
 * @param options - Options for getting receipt data
 */
export const getReceiptData = (options: GetReceiptDataOptions): void => {
	if (["IOS_APP"].includes(platform)) {
		const { callback } = options;

		registerCb((response: InAppPurchaseResponse) => {
			const { type } = response;
			if (type === "getReceiptData") {
				callback && callback(response);
			}
		}, { key: "getReceiptData" });

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "getReceiptData"
			} as InAppPurchaseIosMessage);
		}
	}
};