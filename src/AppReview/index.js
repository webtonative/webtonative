import { platform, registerCb, webToNativeIos, webToNative } from "../utills";
/**
 *
 *
 */
export const prompt = (options = {}) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "showAppRating",
			});
		
		platform === "ANDROID_APP" &&
			webToNative.showInAppReview();
	}
};
