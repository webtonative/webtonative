import { platform, webToNativeIos } from "../utills";
/**
 *
 *
 */
export const trigger = (options = {}) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "haptikEffect",
				effect: options.effect,
			});
	}
};
