import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
/**
 *
 *
 */
export const playMedia = (options = {}) => {
	const { url, imageUrl = "https://images.freeimages.com/images/large-previews/3b2/prague-conference-center-1056491.jpg"  } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		
		platform === "ANDROID_APP" && webToNative.playMedia(JSON.stringify({url,imageUrl}));

		platform === "IOS_APP" && webToNativeIos.postMessage({
			"action": "playMedia",
			url,
			image:imageUrl
		});
	}
};

/**
 *
 *
 */
export const pauseMedia = (options = {}) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		
		platform === "ANDROID_APP" && webToNative.pausePlaying();

		platform === "IOS_APP" && webToNativeIos.postMessage({
			"action": "pauseMedia"
		});
	}
};

/**
 *
 *
 */
export const stopMedia = (options = {}) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		
		platform === "ANDROID_APP" && webToNative.stopPlaying();

		platform === "IOS_APP" && webToNativeIos.postMessage({
			"action": "stopMedia"
		});
	}
};