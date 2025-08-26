import { platform, webToNativeIos } from "../utills";
import { HapticsOptions, HapticsIosMessage } from "./types";

/**
 * Triggers a haptic feedback effect
 * @param options - Options for the haptic effect
 */
export const trigger = (options: HapticsOptions = {}): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "haptikEffect",
				effect: options.effect,
			} as HapticsIosMessage);
		}
	}
};