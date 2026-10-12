import * as events from "./events";

import { platform, webToNative, webToNativeIos, registerCb } from "../utills";
import {
	FacebookAnalyticsCollectionOptions,
	FacebookAnalyticsCollectionStatusOptions,
	FacebookAnalyticsCollectionStatusResponse,
} from "./types";

/**
 * Enables or disables Facebook Analytics collection
 * @param options - Options for setting analytics collection
 * @example wtn.facebook.setCollection({enabled: true});
 */
const setFacebookAnalyticsCollection = (options: FacebookAnalyticsCollectionOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, enabled } = options;

		registerCb(
			(response: FacebookAnalyticsCollectionStatusResponse) => {
				if (response && response.type === "getFacebookAnalyticsCollectionStatus") {
					callback && callback(response);
				}
			},
			{ key: "setFacebookAnalyticsCollection" }
		);

		platform === "ANDROID_APP" &&
			webToNative.setFacebookAnalyticsCollection &&
			webToNative.setFacebookAnalyticsCollection(enabled);

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setFacebookAnalyticsCollection",
				enabled,
			});
		}
	}
};

/**
 * Gets whether Facebook Analytics collection is enabled
 * @param options - Options containing the callback that receives the status
 * @example wtn.facebook.getCollectionStatus({callback: (response) => console.log(response.enabled)});
 */
const getFacebookAnalyticsCollectionStatus = (
	options: FacebookAnalyticsCollectionStatusOptions = {}
): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback } = options;

		registerCb(
			(response: FacebookAnalyticsCollectionStatusResponse) => {
				if (response && response.type === "getFacebookAnalyticsCollectionStatus") {
					callback && callback(response);
				}
			},
			{ key: "getFacebookAnalyticsCollectionStatus" }
		);

		platform === "ANDROID_APP" &&
			webToNative.getFacebookAnalyticsCollectionStatus &&
			webToNative.getFacebookAnalyticsCollectionStatus();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "getFacebookAnalyticsCollectionStatus",
			});
		}
	}
};

export { events, setFacebookAnalyticsCollection, getFacebookAnalyticsCollectionStatus };
