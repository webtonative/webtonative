import { platform, webToNative, webToNativeIos } from "../utills";
import { SoundIosMessage } from "./types";

/**
 * Plays a native sound
 * @param soundName - Name of the sound to play
 * @example wtn.Sound.play("chat_ping");
 */
export const play = (soundName: string): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "ANDROID_APP" && webToNative.playSound && webToNative.playSound(soundName);

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "playSound",
				soundName,
			} as SoundIosMessage);
		}
	}
};
