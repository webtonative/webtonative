import { BaseResponse } from "../types";
import { platform, registerCb, webToNative, webToNativeIos } from "../utills";

export const login = (options: Record<string, any>): void => {
	const { callback, ...rest } = options || {};

	registerCb((response: BaseResponse) => {
		const { type } = response;
		if (type === "unifiedLogin") {
			callback && callback(response);
		}
	});

	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "ANDROID_APP" && webToNative.unifiedLogin(JSON.stringify(options));

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "unifiedLogin",
				data: rest,
			});
		}
	}
};
export const setUserInfo = (options: Record<string, any>): void => {
	const { callback, ...rest } = options || {};

	registerCb((response: BaseResponse) => {
		const { type } = response;
		if (type === "setUnifiedUserInfo") {
			callback && callback(response);
		}
	});

	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "ANDROID_APP" && webToNative.setUnifiedUserInfo(JSON.stringify(options));

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setUnifiedUserInfo",
				data: rest,
			});
		}
	}
};
export const getUserInfo = (options: Record<string, any>): void => {
	const { callback } = options || {};

	registerCb((response: BaseResponse) => {
		const { type } = response;
		if (type === "getUnifiedUserInfo") {
			callback && callback(response);
		}
	});

	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "ANDROID_APP" && webToNative.getUnifiedUserInfo();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "getUnifiedUserInfo",
			});
		}
	}
};
export const logout = (): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "ANDROID_APP" && webToNative.unifiedLogout();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "unifiedLogout",
			});
		}
	}
};
