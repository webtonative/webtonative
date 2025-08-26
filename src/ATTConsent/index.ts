import { platform, registerCb, webToNativeIos } from "../utills";
import { ATTConsentOptions, ATTConsentResponse, ATTConsentIosMessage } from "./types";

/**
 * This function opens ATTConsent
 * @param options - Options for ATT consent request
 * @example wtn.ATTConsent.request({
 *  callback:(value)=>{
 *    console.log(value);
 *  }
 * });
 */
export const request = (options: ATTConsentOptions = {}): void => {
	const { callback } = options;
	if (["IOS_APP"].includes(platform)) {
		registerCb((response: ATTConsentResponse) => {
			const { type } = response;
			if (type === "requestTrackingConsent") {
				callback && callback(response);
			}
		});

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "requestTrackingAuthorization",
			} as ATTConsentIosMessage);
		}
	}
};

/**
 * This function gets the current ATT consent status
 * @param options - Options for ATT consent status
 */
export const status = (options: ATTConsentOptions = {}): void => {
	const { callback } = options;
	if (["IOS_APP"].includes(platform)) {
		registerCb((response: ATTConsentResponse) => {
			const { type } = response;
			if (type === "trackingConsentStatus") {
				callback && callback(response);
			}
		});

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "trackingConsentStatus",
			} as ATTConsentIosMessage);
		}
	}
};