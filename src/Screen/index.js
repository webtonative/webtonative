import { platform, webToNative, webToNativeIos } from "../utills";
/**
 *
 *
 */
export const keepScreenOn = () => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "keepScreenOn",
				flag: true,
			});

		platform === "ANDROID_APP" && webToNative.keepScreenOn();
	}
};

/**
 *
 *
 */
export const keepScreenNormal = () => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "keepScreenOn",
				flag: false,
			});

		platform === "ANDROID_APP" && webToNative.keepScreenNormal();
	}
};
