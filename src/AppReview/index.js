import { platform, registerCb, webToNativeIos } from "../utills";
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
	}
};
