import { platform, registerCb, webToNativeIos, webToNative } from "../utills";
import { AppReviewOptions, AppReviewIosMessage } from "./types";

/**
 * Shows the app review/rating prompt
 * @param options - Options for app review prompt
 */
export const prompt = (options: AppReviewOptions = {}): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "showAppRating",
			} as AppReviewIosMessage);
		}
		
		platform === "ANDROID_APP" &&
			webToNative.showInAppReview();
	}
};