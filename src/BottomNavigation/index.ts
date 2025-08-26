import { platform, webToNative, webToNativeIos } from "../utills";
import { BottomNavigationShowOptions, BottomNavigationIosMessage } from "./types";

/**
 * Hides the bottom navigation
 */
export const hide = (): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "ANDROID_APP" &&
        	webToNative.showHideStickyFooter(false);

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "showHideStickyFooter",
				show: false,
			} as BottomNavigationIosMessage);
		}
	}
};

/**
 * Shows the bottom navigation
 * @param options - Options for showing bottom navigation
 */
export const show = (options: BottomNavigationShowOptions = {}): void => {
	const { key } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "ANDROID_APP" &&
        	webToNative.showHideStickyFooter(true);

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "showHideStickyFooter",
				show: true,
				key,
			} as BottomNavigationIosMessage);
		}
	}
};