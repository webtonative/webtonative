import { platform, webToNative, webToNativeIos } from "../utills";
import { ScreenIosMessage } from "./types";

/**
 * Keeps the screen on (prevents screen from turning off)
 */
export const keepScreenOn = (): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "keepScreenOn",
				flag: true,
			} as ScreenIosMessage);
		}

		platform === "ANDROID_APP" && webToNative.keepScreenOn();
	}
};

/**
 * Returns screen to normal behavior (allows screen to turn off)
 */
export const keepScreenNormal = (): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "keepScreenOn",
				flag: false,
			} as ScreenIosMessage);
		}

		platform === "ANDROID_APP" && webToNative.keepScreenNormal();
	}
};