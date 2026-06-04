import { platform, webToNative, webToNativeIos } from "../utills";

export const open = (): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;

	if (platform === "ANDROID_APP") {
		webToNative.openAppSettingForPermission &&
			webToNative.openAppSettingForPermission(null);
	} else if (platform === "IOS_APP") {
		webToNativeIos &&
			webToNativeIos.postMessage({ action: "openAppSettingForPermission" });
	}
};
