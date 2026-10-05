import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import { NotificationOptions, NotificationResponse, NotificationIosMessage, SetTagOptions } from "./types";

/**
 * Checks notification permission status
 * @param options - Options for checking notification permission
 */

// export const checkNotificationPermission = (options: NotificationOptions = {}): void => {
// 	const { callback } = options;
// 	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
// 		registerCb((response: NotificationResponse) => {
// 			const { type } = response;
// 			if (type === "checkNotificationPermission") {
// 				callback && callback(response);
// 			}
// 		}, { key: "checkNotificationPermission" });

// 		platform === "ANDROID_APP" && webToNative.checkNotificationPermission();

// 		if (platform === "IOS_APP" && webToNativeIos) {
// 			webToNativeIos.postMessage({
// 				action: "checkNotificationPermission",
// 			} as NotificationIosMessage);
// 		}
// 	}
// };

/**
 * Opens the app notification settings page
 */
export const openAppNotificationPage = (): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "ANDROID_APP" && webToNative.openAppNotificationPage();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "openAppNotificationPage",
			} as NotificationIosMessage);
		}
	}
};

const callNotificationInterface = (
	action: string,
	callback?: NotificationOptions["callback"],
	data?: Record<string, any>
): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response: NotificationResponse) => {
			const { type } = response;
			if (type === action) {
				callback && callback(response);
			}
		}, { key: action });

		if (platform === "ANDROID_APP") {
			data === undefined ? webToNative[action]() : webToNative[action](JSON.stringify(data));
		}

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action,
				...(data !== undefined && { data }),
			} as NotificationIosMessage);
		}
	}
};

/**
 * Sets notification tags
 * @param options - Tag data and callback
 */
export const setTag = (options: SetTagOptions): void => {
	const { data, callback } = options || ({} as SetTagOptions);
	if (!data) {
		throw "data is required";
	}
	callNotificationInterface("w2nSetTag", callback, data);
};

/**
 * Subscribes the device to notifications
 */
export const subscribe = (options: NotificationOptions = {}): void => {
	callNotificationInterface("w2nSubscribe", options.callback);
};

/**
 * Unsubscribes the device from notifications
 */
export const unsubscribe = (options: NotificationOptions = {}): void => {
	callNotificationInterface("w2nUnsubscribe", options.callback);
};

/**
 * Checks whether the device is subscribed to notifications
 */
export const isSubscribed = (options: NotificationOptions = {}): void => {
	callNotificationInterface("w2nIsSubscribed", options.callback);
};

/**
 * Gets the notification tags set on the device
 */
export const getTags = (options: NotificationOptions = {}): void => {
	callNotificationInterface("w2nGetTags", options.callback);
};
