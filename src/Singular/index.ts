import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import {
	SingularResponse,
	SingularCallback,
	SingularCallbackOptions,
	SingularCustomUserIdOptions,
	SingularGlobalPropertyOptions,
	SingularUnsetGlobalPropertyOptions,
	SingularEventOptions,
	SingularEventParams,
	SingularRevenueOptions,
	SingularRevenueParams,
	SingularReferrerShortLinkOptions,
	SingularReferrerShortLinkParams,
	SingularLimitDataSharingOptions,
	SingularFCMTokenOptions,
	SingularIMEIOptions,
	SingularIosMessage,
} from "./types";

const isSupportedPlatform = (): boolean => ["ANDROID_APP", "IOS_APP"].includes(platform);

/** Native only receives the keys the caller actually filled in. */
const compact = <T extends Record<string, any>>(payload: T): T => {
	const result = {} as T;
	(Object.keys(payload) as (keyof T)[]).forEach((key) => {
		if (payload[key] !== undefined) result[key] = payload[key];
	});
	return result;
};

/** Fires the caller's callback once the response for this action comes back. */
const listen = (action: string, callback?: SingularCallback): void => {
	registerCb(
		(response: SingularResponse) => {
			const { type } = response;
			if (type === action) {
				callback && callback(response);
			}
		},
		{ key: action }
	);
};

/**
 * Sets the Singular custom user id, so events are attributed to your own user.
 * @example Singular.setCustomUserId({ userId: "user_12345", callback: (res) => console.log(res) })
 */
export const setCustomUserId = (options: SingularCustomUserIdOptions): void => {
	if (isSupportedPlatform()) {
		const { userId, callback } = options || ({} as SingularCustomUserIdOptions);

		listen("setCustomUserId", callback);

		platform === "ANDROID_APP" &&
			webToNative.setCustomUserId &&
			webToNative.setCustomUserId(userId);

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setCustomUserId",
				userId,
			} as SingularIosMessage);
		}
	}
};

/**
 * Clears the custom user id previously set — call this on logout.
 * @example Singular.unsetCustomUserId({ callback: (res) => console.log(res) })
 */
export const unsetCustomUserId = (options: SingularCallbackOptions = {}): void => {
	if (isSupportedPlatform()) {
		const { callback } = options || {};

		listen("unsetCustomUserId", callback);

		platform === "ANDROID_APP" &&
			webToNative.unsetCustomUserId &&
			webToNative.unsetCustomUserId();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "unsetCustomUserId",
			} as SingularIosMessage);
		}
	}
};

/**
 * Reads back every global property currently attached to Singular events.
 * @example Singular.getGlobalProperties({ callback: (res) => console.log(res) })
 */
export const getGlobalProperties = (options: SingularCallbackOptions = {}): void => {
	if (isSupportedPlatform()) {
		const { callback } = options || {};

		listen("getGlobalPropertiesToSingular", callback);

		platform === "ANDROID_APP" &&
			webToNative.getGlobalPropertiesToSingular &&
			webToNative.getGlobalPropertiesToSingular();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "getGlobalPropertiesToSingular",
			} as SingularIosMessage);
		}
	}
};

/**
 * Attaches a global property that rides along with every event sent afterwards.
 * @example Singular.setGlobalProperty({ key: "plan", value: "pro", overrideExisting: true })
 */
export const setGlobalProperty = (options: SingularGlobalPropertyOptions): void => {
	if (isSupportedPlatform()) {
		const {
			key,
			value,
			overrideExisting = true,
			callback,
		} = options || ({} as SingularGlobalPropertyOptions);

		listen("setGlobalPropertyToSingular", callback);

		platform === "ANDROID_APP" &&
			webToNative.setGlobalPropertyToSingular &&
			webToNative.setGlobalPropertyToSingular(key, value, overrideExisting);

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setGlobalPropertyToSingular",
				key,
				value,
				overrideExisting,
			} as SingularIosMessage);
		}
	}
};

/**
 * Removes a single global property.
 * @example Singular.unsetGlobalProperty({ key: "plan" })
 */
export const unsetGlobalProperty = (options: SingularUnsetGlobalPropertyOptions): void => {
	if (isSupportedPlatform()) {
		const { key, callback } = options || ({} as SingularUnsetGlobalPropertyOptions);

		listen("unsetGlobalPropertyToSingular", callback);

		platform === "ANDROID_APP" &&
			webToNative.unsetGlobalPropertyToSingular &&
			webToNative.unsetGlobalPropertyToSingular(key);

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "unsetGlobalPropertyToSingular",
				key,
			} as SingularIosMessage);
		}
	}
};

/**
 * Removes every global property at once.
 * @example Singular.clearGlobalProperties({ callback: (res) => console.log(res) })
 */
export const clearGlobalProperties = (options: SingularCallbackOptions = {}): void => {
	if (isSupportedPlatform()) {
		const { callback } = options || {};

		listen("clearGlobalPropertiesToSingular", callback);

		platform === "ANDROID_APP" &&
			webToNative.clearGlobalPropertiesToSingular &&
			webToNative.clearGlobalPropertiesToSingular();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "clearGlobalPropertiesToSingular",
			} as SingularIosMessage);
		}
	}
};

/**
 * Logs an event to Singular, optionally with your own attributes or Singular event values.
 * @example Singular.logEvent({ eventName: "sng_add_to_cart", eventJson: { item: "shoes" } })
 */
export const logEvent = (options: SingularEventOptions): void => {
	if (isSupportedPlatform()) {
		const { eventName, eventJson, eventValues, callback } =
			options || ({} as SingularEventOptions);

		listen("addEventToSingular", callback);

		const params = compact({ eventName, eventJson, eventValues } as SingularEventParams);

		platform === "ANDROID_APP" &&
			webToNative.addEventToSingular &&
			webToNative.addEventToSingular(JSON.stringify(params));

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "addEventToSingular",
				...params,
			} as SingularIosMessage);
		}
	}
};

/**
 * Reports revenue to Singular — standard purchase revenue, revenue under an event name
 * of your own, or ad revenue from a mediation callback.
 * @example Singular.logRevenue({ revenue: { currency: "USD", amount: 9.99 } })
 * @example Singular.logRevenue({ adRevenue: { currency: "USD", amount: 0.02 } })
 */
export const logRevenue = (options: SingularRevenueOptions): void => {
	if (isSupportedPlatform()) {
		const { revenue, customRevenue, adRevenue, callback } =
			options || ({} as SingularRevenueOptions);

		listen("addRevenueToSingular", callback);

		const params = compact({ revenue, customRevenue, adRevenue } as SingularRevenueParams);

		platform === "ANDROID_APP" &&
			webToNative.addRevenueToSingular &&
			webToNative.addRevenueToSingular(JSON.stringify(params));

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "addRevenueToSingular",
				...params,
			} as SingularIosMessage);
		}
	}
};

/**
 * Builds a referrer short link off a Singular base link, so a user can share it.
 * @example Singular.createReferrerShortLink({ baseLink: "https://sng.link/...", referrerName: "Ada", referrerId: "user_12345" })
 */
export const createReferrerShortLink = (options: SingularReferrerShortLinkOptions): void => {
	if (isSupportedPlatform()) {
		const { baseLink, referrerName, referrerId, passthroughParams, callback } =
			options || ({} as SingularReferrerShortLinkOptions);

		listen("createReferrerShortLink", callback);

		const params = compact({
			baseLink,
			referrerName,
			referrerId,
			passthroughParams,
		} as SingularReferrerShortLinkParams);

		platform === "ANDROID_APP" &&
			webToNative.createReferrerShortLink &&
			webToNative.createReferrerShortLink(JSON.stringify(params));

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "createReferrerShortLink",
				...params,
			} as SingularIosMessage);
		}
	}
};

/**
 * Returns the current Singular session id.
 * @example Singular.getSessionId({ callback: (res) => console.log(res) })
 */
export const getSessionId = (options: SingularCallbackOptions = {}): void => {
	if (isSupportedPlatform()) {
		const { callback } = options || {};

		listen("getSessionId", callback);

		platform === "ANDROID_APP" && webToNative.getSessionId && webToNative.getSessionId();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "getSessionId",
			} as SingularIosMessage);
		}
	}
};

/**
 * Reads whether data sharing is currently limited for this user.
 * @example Singular.getShouldLimitDataSharing({ callback: (res) => console.log(res) })
 */
export const getShouldLimitDataSharing = (options: SingularCallbackOptions = {}): void => {
	if (isSupportedPlatform()) {
		const { callback } = options || {};

		listen("getShouldLimitDataSharing", callback);

		platform === "ANDROID_APP" &&
			webToNative.getShouldLimitDataSharing &&
			webToNative.getShouldLimitDataSharing();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "getShouldLimitDataSharing",
			} as SingularIosMessage);
		}
	}
};

/**
 * Records the user's CCPA choice on sharing their data downstream.
 * @example Singular.setShouldLimitDataSharing({ shouldLimit: true })
 */
export const setShouldLimitDataSharing = (options: SingularLimitDataSharingOptions): void => {
	if (isSupportedPlatform()) {
		const { shouldLimit, callback } = options || ({} as SingularLimitDataSharingOptions);

		listen("setShouldLimitDataSharing", callback);

		platform === "ANDROID_APP" &&
			webToNative.setShouldLimitDataSharing &&
			webToNative.setShouldLimitDataSharing(shouldLimit);

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setShouldLimitDataSharing",
				shouldLimit,
			} as SingularIosMessage);
		}
	}
};

/**
 * Hands Singular the FCM device token used for push.
 * @example Singular.setFCMDeviceToken({ token: "<fcm token>" })
 */
export const setFCMDeviceToken = (options: SingularFCMTokenOptions): void => {
	if (isSupportedPlatform()) {
		const { token, callback } = options || ({} as SingularFCMTokenOptions);

		listen("setFCMDeviceToken", callback);

		platform === "ANDROID_APP" &&
			webToNative.setFCMDeviceToken &&
			webToNative.setFCMDeviceToken(token);

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setFCMDeviceToken",
				token,
			} as SingularIosMessage);
		}
	}
};

/**
 * Reads whether tracking is currently stopped.
 * @example Singular.isAllTrackingStopped({ callback: (res) => console.log(res) })
 */
export const isAllTrackingStopped = (options: SingularCallbackOptions = {}): void => {
	if (isSupportedPlatform()) {
		const { callback } = options || {};

		listen("isAllTrackingStopped", callback);

		platform === "ANDROID_APP" &&
			webToNative.isAllTrackingStopped &&
			webToNative.isAllTrackingStopped();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "isAllTrackingStopped",
			} as SingularIosMessage);
		}
	}
};

/**
 * Stops all Singular tracking until tracking is resumed.
 * @example Singular.stopAllTracking({ callback: (res) => console.log(res) })
 */
export const stopAllTracking = (options: SingularCallbackOptions = {}): void => {
	if (isSupportedPlatform()) {
		const { callback } = options || {};

		listen("stopAllTracking", callback);

		platform === "ANDROID_APP" && webToNative.stopAllTracking && webToNative.stopAllTracking();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "stopAllTracking",
			} as SingularIosMessage);
		}
	}
};

/**
 * Resumes tracking after stopAllTracking.
 * @example Singular.resumeAllTracking({ callback: (res) => console.log(res) })
 */
export const resumeAllTracking = (options: SingularCallbackOptions = {}): void => {
	if (isSupportedPlatform()) {
		const { callback } = options || {};

		listen("resumeAllTracking", callback);

		platform === "ANDROID_APP" &&
			webToNative.resumeAllTracking &&
			webToNative.resumeAllTracking();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "resumeAllTracking",
			} as SingularIosMessage);
		}
	}
};

/**
 * Sets the device IMEI as an extra identifier.
 * @example Singular.setIMEI({ imei: "value" })
 */
export const setIMEI = (options: SingularIMEIOptions): void => {
	if (isSupportedPlatform()) {
		const { imei, callback } = options || ({} as SingularIMEIOptions);

		listen("setIMEI", callback);

		platform === "ANDROID_APP" && webToNative.setIMEI && webToNative.setIMEI(imei);

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setIMEI",
				imei,
			} as SingularIosMessage);
		}
	}
};

/**
 * Records that the user opted in to tracking.
 * @example Singular.trackingOptIn({ callback: (res) => console.log(res) })
 */
export const trackingOptIn = (options: SingularCallbackOptions = {}): void => {
	if (isSupportedPlatform()) {
		const { callback } = options || {};

		listen("trackingOptIn", callback);

		platform === "ANDROID_APP" && webToNative.trackingOptIn && webToNative.trackingOptIn();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "trackingOptIn",
			} as SingularIosMessage);
		}
	}
};

/**
 * Marks this user as under 13, so Singular handles their data accordingly.
 * @example Singular.trackingUnder13({ callback: (res) => console.log(res) })
 */
export const trackingUnder13 = (options: SingularCallbackOptions = {}): void => {
	if (isSupportedPlatform()) {
		const { callback } = options || {};

		listen("trackingUnder13", callback);

		platform === "ANDROID_APP" && webToNative.trackingUnder13 && webToNative.trackingUnder13();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "trackingUnder13",
			} as SingularIosMessage);
		}
	}
};

/**
 * Stops Singular collecting advertising identifiers such as IDFA / GAID.
 * @example Singular.setLimitAdvertisingIdentifiers({ callback: (res) => console.log(res) })
 */
export const setLimitAdvertisingIdentifiers = (options: SingularCallbackOptions = {}): void => {
	if (isSupportedPlatform()) {
		const { callback } = options || {};

		listen("setLimitAdvertisingIdentifiers", callback);

		platform === "ANDROID_APP" &&
			webToNative.setLimitAdvertisingIdentifiers &&
			webToNative.setLimitAdvertisingIdentifiers();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setLimitAdvertisingIdentifiers",
			} as SingularIosMessage);
		}
	}
};

export default {
	setCustomUserId,
	unsetCustomUserId,
	getGlobalProperties,
	setGlobalProperty,
	unsetGlobalProperty,
	clearGlobalProperties,
	logEvent,
	logRevenue,
	createReferrerShortLink,
	getSessionId,
	getShouldLimitDataSharing,
	setShouldLimitDataSharing,
	setFCMDeviceToken,
	isAllTrackingStopped,
	stopAllTracking,
	resumeAllTracking,
	setIMEI,
	trackingOptIn,
	trackingUnder13,
	setLimitAdvertisingIdentifiers,
};
