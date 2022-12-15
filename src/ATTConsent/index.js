import { platform, registerCb, webToNativeIos } from "../utills";

/**
 * This function opens ATTConsent
 * @param {object} options
 * @example wtn.ATTConsent.request({
 *  callback:(value)=>{
 *    console.log(value);
 *  }
 * });
 */
export const request = (options = {}) => {
	const { callback } = options;
	if (["IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "requestTrackingConsent") {
				callback && callback(response);
			}
		});

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "requestTrackingAuthorization",
			});
	}
};

export const status = (options = {}) => {
	const { callback } = options;
	if (["IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "trackingConsentStatus") {
				callback && callback(response);
			}
		});

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "trackingConsentStatus",
			});
	}
};
