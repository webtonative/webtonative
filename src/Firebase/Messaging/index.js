import { platform, webToNative, webToNativeIos, registerCb } from "../../utills";

/**
 *
 * @example
 */
export const subscribe = (options) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { toTopic } = options;

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "firebaseSubscribeToTopic",
				topic: toTopic,
			});

		platform === "ANDROID_APP" && webToNative.subscribeToTopic(toTopic);
	}
};

/**
 *
 *
 */
export const unsubscribe = (options) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { fromTopic } = options;

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "firebaseUnsubscribeFromTopic",
				topic: fromTopic,
			});

		platform === "ANDROID_APP" && webToNative.unsubscribeFromTopic(fromTopic);
	}
};

export const getFCMToken = (options) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback } = options;
		registerCb((response) => {
			const { type } = response;
			if (type === "getFCMToken") {
				if (platform === "ANDROID_APP") {
					response.token = response.fcm_registration_token;
				}
				callback && callback(response);
			}
		});

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "getFCMToken",
			});

		platform === "ANDROID_APP" && webToNative.getRegistrationToken();
	}
};
