import { platform, webToNative, webToNativeIos, registerCb } from "../utills";
import {
	FacebookEventOptions,
	FacebookPurchaseOptions,
	FacebookEventIosMessage,
	FacebookAnalyticsCollectionOptions,
	FacebookAnalyticsCollectionStatusOptions,
	FacebookAnalyticsCollectionStatusResponse,
} from "./types";

/**
 * Sends a Facebook event
 * @param options - Options for the Facebook event
 */
export const send = (options: FacebookEventOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { event, valueToSum, parameters } = options;

		platform === "ANDROID_APP" && webToNative.addFbEvents(event, JSON.stringify(parameters));

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "sendFBEvent",
				eventName: event,
				valueToSum,
				parameters,
			} as FacebookEventIosMessage);
		}
	}
};

/**
 * Sends a Facebook purchase event
 * @param options - Options for the Facebook purchase event
 * @example wtn.facebook.events.sendPurchase({amount: 10.99, currency: "USD", parameters: {item_name: "Product"}});
 */
export const sendPurchase = (options: FacebookPurchaseOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { amount, currency, parameters } = options;

		platform === "ANDROID_APP" &&
			webToNative.addFbPurchaseEvent(amount, currency, JSON.stringify(parameters));

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "sendFBPurchaseEvent",
				currency,
				amount,
				parameters,
			} as FacebookEventIosMessage);
		}
	}
};

/**
 * Enables or disables Facebook Analytics collection
 * @param options - Options for setting analytics collection
 * @example wtn.facebook.events.setCollection({enabled: true});
 */
export const setCollection = (options: FacebookAnalyticsCollectionOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { enabled } = options;

		platform === "ANDROID_APP" &&
			webToNative.setFacebookAnalyticsCollection &&
			webToNative.setFacebookAnalyticsCollection(enabled);

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setFacebookAnalyticsCollection",
				enabled,
			} as FacebookEventIosMessage);
		}
	}
};

/**
 * Gets whether Facebook Analytics collection is enabled
 * @param options - Options containing the callback that receives the status
 * @example wtn.facebook.events.getCollectionStatus({callback: (response) => console.log(response.enabled)});
 */
export const getCollectionStatus = (options: FacebookAnalyticsCollectionStatusOptions = {}): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback } = options;

		registerCb(
			(response: FacebookAnalyticsCollectionStatusResponse) => {
				if (response && response.type === "getFacebookAnalyticsCollectionStatus") {
					callback && callback(response);
				}
			},
			{ key: "getFacebookAnalyticsCollectionStatus" }
		);

		platform === "ANDROID_APP" &&
			webToNative.getFacebookAnalyticsCollectionStatus &&
			webToNative.getFacebookAnalyticsCollectionStatus();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "getFacebookAnalyticsCollectionStatus",
			} as FacebookEventIosMessage);
		}
	}
};
