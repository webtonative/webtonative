import { platform, webToNative, webToNativeIos } from "../utills";
import { MediaPlayerOptions, MediaPlayerIosMessage, MediaPlayerAndroidParams } from "./types";

/**
 * Plays media content
 * @param options - Options for playing media
 */
export const playMedia = (options: MediaPlayerOptions = {}): void => {
	const { url, imageUrl = "https://images.freeimages.com/images/large-previews/3b2/prague-conference-center-1056491.jpg" } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		
		platform === "ANDROID_APP" && webToNative.playMedia(JSON.stringify({url, imageUrl} as MediaPlayerAndroidParams));

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				"action": "playMedia",
				url,
				image: imageUrl
			} as MediaPlayerIosMessage);
		}
	}
};

/**
 * Pauses currently playing media
 * @param options - Options for pausing media
 */
export const pauseMedia = (options: MediaPlayerOptions = {}): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		
		platform === "ANDROID_APP" && webToNative.pausePlaying();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				"action": "pauseMedia"
			} as MediaPlayerIosMessage);
		}
	}
};

/**
 * Stops currently playing media
 * @param options - Options for stopping media
 */
export const stopMedia = (options: MediaPlayerOptions = {}): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		
		platform === "ANDROID_APP" && webToNative.stopPlaying();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				"action": "stopMedia"
			} as MediaPlayerIosMessage);
		}
	}
};