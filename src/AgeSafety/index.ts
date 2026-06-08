import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import {
	AgeSafetyResponse,
	GetAgeSignalsOptions,
	NotifySignificantChangeOptions,
	AgeSafetyIosMessage,
} from "./types";

/**
 * Gets age signals based on configured age gates
 * @param options - Options including ageGates threshold and callback
 * @example wtn.AgeSafety.getAgeSignals({
 *  ageGates: 18,
 *  callback: (data) => {
 *    console.log(data);
 *  }
 * });
 */
export const getAgeSignals = (options: GetAgeSignalsOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { ageGates, callback } = options;

		registerCb((response: AgeSafetyResponse) => {
			const { type } = response;
			if (type === "getAgeSignals") {
				callback && callback(response);
			}
		});

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "getAgeSignals",
				ageGates,
			} as AgeSafetyIosMessage);
		}

		platform === "ANDROID_APP" &&
			webToNative.getAgeSignals &&
			webToNative.getAgeSignals(JSON.stringify({ ageGates }));
	}
};

/**
 * Notifies the app of a significant topic change (iOS only)
 * @param options - Options including topicString
 * @example wtn.AgeSafety.notifySignificantChange({
 *  topicString: "topicName"
 * });
 */
export const notifySignificantChange = (options: NotifySignificantChangeOptions): void => {
	if (["IOS_APP"].includes(platform)) {
		const { topicString } = options;

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "notifySignificantChange",
				topicString,
			} as AgeSafetyIosMessage);
		}
	}
};
