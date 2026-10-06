import { BaseResponse } from "../types";
import { LoginOptions } from "./types";
import { platform, registerCb, webToNative, webToNativeIos } from "../utills";

export const login = (
	userData: Record<string, any>,
	options: LoginOptions = {}
): Promise<BaseResponse> => {
	return new Promise((resolve, reject) => {
		if (!["ANDROID_APP", "IOS_APP"].includes(platform)) {
			reject("This function will work in Native App Powered By WebToNative");
			return;
		}

		registerCb((response: BaseResponse) => {
			const { type } = response;
			if (type === "unifiedLogin") {
				resolve(response);
			}
		}, { key: "unifiedLogin" });

		const data = { ...userData, ...options };

		platform === "ANDROID_APP" && webToNative.unifiedLogin(JSON.stringify(data));

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "unifiedLogin",
				data,
			});
		}
	});
};
export const setUserInfo = (options: Record<string, any>): void => {
	const { callback, ...rest } = options || {};

	registerCb((response: BaseResponse) => {
		const { type } = response;
		if (type === "setUnifiedUserInfo") {
			callback && callback(response);
		}
	}, { key: "setUnifiedUserInfo" });

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
	}, { key: "getUnifiedUserInfo" });

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
