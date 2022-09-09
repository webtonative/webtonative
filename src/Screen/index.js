import { platform, webToNativeIos } from "../utills";
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
	}
};
