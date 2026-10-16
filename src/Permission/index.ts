import { BaseResponse } from "../types";
import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import {
	PermissionType,
	PermissionResponse,
	PermissionOptions,
	PermissionOptionsRequest,
} from "./types";

const callPermissionInterface = <T extends BaseResponse>(
	action: string,
	data: Record<string, any>,
	callback?: (response: T) => void
): Promise<T> => {
	return new Promise((resolve, reject) => {
		if (!["ANDROID_APP", "IOS_APP"].includes(platform)) {
			reject("This function will work in Native App Powered By WebToNative");
			return;
		}

		registerCb(
			(response: T) => {
				if (response.type === action) {
					callback && callback(response);
					resolve(response);
				}
			},
			{ key: action }
		);

		if (platform === "ANDROID_APP") {
			webToNative[action] && webToNative[action](JSON.stringify(data));
		} else if (platform === "IOS_APP") {
			webToNativeIos && webToNativeIos.postMessage({ action, ...data });
		}
	});
};

export const check = (options: PermissionOptions = {}): Promise<PermissionResponse> => {
	const { callback, permissions } = options;
	return callPermissionInterface("checkPermission", { permissions }, callback);
};

export const request = (options: PermissionOptionsRequest = {}): Promise<PermissionResponse> => {
	const { callback, permission } = options;
	return callPermissionInterface("requestPermission", { permission }, callback);
};

export const open = (options?: {
	permission: PermissionType;
	callback?: (response: BaseResponse) => void;
	alertDialogStyle?: Object;
}): Promise<BaseResponse> => {
	const { permission, callback, alertDialogStyle } = options || {};
	return callPermissionInterface("openSettings", { permission, alertDialogStyle }, callback);
};
