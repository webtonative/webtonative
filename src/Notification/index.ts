import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import { NotificationOptions, NotificationResponse, NotificationIosMessage } from "./types";

/**
 * Checks notification permission status
 * @param options - Options for checking notification permission
 */
export const checkNotificationPermission = (options: NotificationOptions = {}): void => {
	const { callback } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response: NotificationResponse) => {
			const { type } = response;
			if (type === "checkNotificationPermission") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.checkNotificationPermission();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "checkNotificationPermission",
			} as NotificationIosMessage);
		}
	}
};

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