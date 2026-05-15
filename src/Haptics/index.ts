import { platform, webToNative, webToNativeIos, registerCb } from "../utills";
import { BaseResponse } from "../types";
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
		platform === "ANDROID_APP" && webToNative.haptikEffect(JSON.stringify(options));
	}
};

interface IsHapticSupportedOptions {
	callback?: (response: BaseResponse) => void;
}

export const isHapticSupported = (options: IsHapticSupportedOptions = {}): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback } = options;

		registerCb((response: BaseResponse) => {
			if (response && response.type === "isHapticSupported") {
				callback && callback(response);
			}
		});

		if (platform === "ANDROID_APP") {
			webToNative.isHapticSupported && webToNative.isHapticSupported();
		} else if (platform === "IOS_APP") {
			webToNativeIos &&
				webToNativeIos.postMessage({
					action: "isHapticSupported",
				});
		}
	}
};
