import { platform, webToNative, webToNativeIos } from "../../utills";
import {
	FirebaseAnalyticsCollectionOptions,
	FirebaseUserIdOptions,
	FirebaseUserPropertyOptions,
	FirebaseDefaultParametersOptions,
	FirebaseEventOptions,
	FirebaseScreenOptions,
	FirebaseAnalyticsIosMessage,
} from "../types";

/**
 * Sets Firebase Analytics collection enabled or disabled
 * @param options - Options for setting analytics collection
 */
export const setCollection = (options: FirebaseAnalyticsCollectionOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { enabled } = options;

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setFirebaseAnalyticsCollection",
				enabled,
			} as FirebaseAnalyticsIosMessage);
		}

		platform === "ANDROID_APP" && webToNative.setFirebaseAnalyticsCollection(enabled);
	}
};

/**
 * Sets Firebase user ID
 * @param options - Options for setting user ID
 */
export const setUserId = (options: FirebaseUserIdOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { userId } = options;

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setFirebaseUserId",
				userId,
			} as FirebaseAnalyticsIosMessage);
		}

		platform === "ANDROID_APP" && webToNative.setFirebaseUserId(userId);
	}
};

/**
 * Sets a Firebase user property
 * @param options - Options for setting user property
 */
export const setUserProperty = (options: FirebaseUserPropertyOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { key, value } = options;

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setFirebaseUserProp",
				key,
				value,
			} as FirebaseAnalyticsIosMessage);
		}

		platform === "ANDROID_APP" && webToNative.setFirebaseUserProp(key, value);
	}
};

/**
 * Sets default event parameters for Firebase Analytics
 * @param options - Options for setting default parameters
 */
export const setDefaultEventParameters = (options: FirebaseDefaultParametersOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { parameters } = options;

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setFirebaseDefaultParam",
				parameters,
			} as FirebaseAnalyticsIosMessage);
		}

		platform === "ANDROID_APP" && webToNative.setFirebaseDefaultParam(JSON.stringify(parameters));
	}
};

/**
 * Logs a Firebase Analytics event
 * @param options - Options for logging an event
 */
export const logEvent = (options: FirebaseEventOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { eventName, parameters } = options;

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "logFirebaseEvent",
				eventName,
				parameters,
			} as FirebaseAnalyticsIosMessage);
		}

		platform === "ANDROID_APP" &&
			webToNative.logFirebaseEvent(eventName, JSON.stringify(parameters));
	}
};

/**
 * Logs a Firebase Analytics screen view
 * @param options - Options for logging a screen view
 */
export const logScreen = (options: FirebaseScreenOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { screenName, screenClass } = options;

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "logFirebaseScreenView",
				screenName,
				screenClass,
			} as FirebaseAnalyticsIosMessage);
		}

		platform === "ANDROID_APP" && webToNative.logFirebaseScreenView(screenName, screenClass);
	}
};
