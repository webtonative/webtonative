import { platform, webToNative, webToNativeIos } from "../utills";
/**
 *
 *
 */
export const hide = () => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "ANDROID_APP" &&
        	webToNative.showHideStickyFooter(false);

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "showHideStickyFooter",
				show: false,
			});
	}
};

/**
 *
 *
 */
export const show = (options = {}) => {
	const { key } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "ANDROID_APP" &&
        	webToNative.showHideStickyFooter(true);

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "showHideStickyFooter",
				show: true,
				key,
			});
	}
};
