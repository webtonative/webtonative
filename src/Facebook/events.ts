import { platform, webToNative, webToNativeIos } from "../utills";
import { FacebookEventOptions, FacebookPurchaseOptions, FacebookEventIosMessage } from "./types";

/**
 * Sends a Facebook event
 * @param options - Options for the Facebook event
 */
export const send = (options: FacebookEventOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { event, valueToSum, parameters } = options;

		platform === "ANDROID_APP" && webToNative.addFbEvents(event, parameters);

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

		platform === "ANDROID_APP" && webToNative.addFbPurchaseEvent(amount, currency, parameters);

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