import { BaseResponse } from "../types";
import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import { PermissionType, PermissionResponse, PermissionOptions, PermissionOptionsRequest } from "./types";

export const check = ( options: PermissionOptions = {}): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;

	const { callback,permissions } = options;

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
			webToNative.checkPermission(JSON.stringify({ permissions}));
	} else if (platform === "IOS_APP") {
		webToNativeIos &&
			webToNativeIos.postMessage({ action: "checkPermission", permissions });
	}
};


export const request = (options: PermissionOptionsRequest = {}): void => {
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

export const open = (options?:{permission: PermissionType,callback?: (response: BaseResponse) => void} ): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;


	const { permission , callback } = options || {};

		registerCb((response: BaseResponse) => {
				const { type } = response;
				if (type === "openSettings") {
					callback && callback(response);
				}
			});
	

	if (platform === "ANDROID_APP") {
		webToNative.openSettings &&
			webToNative.openSettings(JSON.stringify({ permission }));
	} else if (platform === "IOS_APP") {
		webToNativeIos &&
			webToNativeIos.postMessage({ action: "openSettings", permission });
	}
};
