import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import { PermissionType, PermissionResponse, PermissionOptions } from "./types";

export const check = ( options: PermissionOptions = {}): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;

	const { callback,permission } = options;

	registerCb(
		(response: PermissionResponse) => {
			if (response.type === "checkPermission") {
				callback && callback(response);
			}
		},
		{ key: "checkPermission" }
	);

	if (platform === "ANDROID_APP") {
		webToNative.checkPermission &&
			webToNative.checkPermission(JSON.stringify({ permission }));
	} else if (platform === "IOS_APP") {
		webToNativeIos &&
			webToNativeIos.postMessage({ action: "checkPermission", permission });
	}
};

export const request = (options: PermissionOptions = {}): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;

	const { callback, permission } = options;

	registerCb(
		(response: PermissionResponse) => {
			if (response.type === "requestPermission") {
				callback && callback(response);
			}
		},
		{ key: "requestPermission" }
	);

	if (platform === "ANDROID_APP") {
		webToNative.requestPermission &&
			webToNative.requestPermission(JSON.stringify({ permission }));
	} else if (platform === "IOS_APP") {
		webToNativeIos &&
			webToNativeIos.postMessage({ action: "requestPermission", permission });
	}
};

export const open = (permission: PermissionType ): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;

	if (platform === "ANDROID_APP") {
		webToNative.openSettings &&
			webToNative.openSettings(JSON.stringify({ permission }));
	} else if (platform === "IOS_APP") {
		webToNativeIos &&
			webToNativeIos.postMessage({ action: "openSettings", permission });
	}
};
