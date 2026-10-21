import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import { ContactsOptions, ContactsResponse, ContactsIosMessage } from "./types";

/**
 * Gets the permission status for contacts access
 * @param options - Options for getting permission status
 */
export const getPermissionStatus = (options: ContactsOptions = {}): void => {
	const { callback } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response: ContactsResponse) => {
			const { type } = response;
			if (type === "contactPermissionStatus") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.getPermissionStatus();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "askUserForContactPermission",
			} as ContactsIosMessage);
		}
	}
};

/**
 * Gets all contacts from the device
 * @param options - Options for getting all contacts
 */
export const getAll = (options: ContactsOptions = {}): void => {
	const { callback } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response: ContactsResponse) => {
			const { type } = response;
			if (type === "contactDetails") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.getAll();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "getUserContactDetails",
			} as ContactsIosMessage);
		}
	}
};