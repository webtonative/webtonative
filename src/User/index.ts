import { platform, webToNative, webToNativeIos } from "../utills";

export const login = (options: Record<string, any>): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "ANDROID_APP" && webToNative.unifiedLogin(JSON.stringify(options));

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "unifiedLogin",
				...options,
			});
		}
	}
};
export const setUserInfo = (options: Record<string, any>): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "ANDROID_APP" && webToNative.setUnifiedUserInfo(JSON.stringify(options));

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setUnifiedUserInfo",
				...options,
			});
		}
	}
};
export const getUserInfo = (): void => {
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
