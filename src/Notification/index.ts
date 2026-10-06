import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import { NotificationResponse, NotificationIosMessage, SetTagOptions } from "./types";

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
	data?: Record<string, any>
): Promise<NotificationResponse> => {
	return new Promise((resolve, reject) => {
		if (!["ANDROID_APP", "IOS_APP"].includes(platform)) {
			reject("This function will work in Native App Powered By WebToNative");
			return;
		}

		registerCb((response: NotificationResponse) => {
			const { type } = response;
			if (type === action) {
				resolve(response);
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
	});
};

/**
 * Sets notification tags
 * @param options - Tag data
 */
export const setTag = (options: SetTagOptions): Promise<NotificationResponse> => {
	const { data } = options || ({} as SetTagOptions);
	if (!data) {
		return Promise.reject("data is required");
	}
	return callNotificationInterface("w2nSetTag", data);
};

/**
 * Subscribes the device to notifications
 */
export const subscribe = (): Promise<NotificationResponse> => callNotificationInterface("w2nSubscribe");

/**
 * Unsubscribes the device from notifications
 */
export const unsubscribe = (): Promise<NotificationResponse> => callNotificationInterface("w2nUnsubscribe");

/**
 * Checks whether the device is subscribed to notifications
 */
export const isSubscribed = (): Promise<NotificationResponse> => callNotificationInterface("w2nIsSubscribed");

/**
 * Gets the notification tags set on the device
 */
export const getTags = (): Promise<NotificationResponse> => callNotificationInterface("w2nGetTags");
