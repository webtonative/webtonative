import { platform, webToNativeIos, registerCb } from "../../utills";

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
	}
};

export const getFCMToken = (options) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback } = options;
		registerCb((response) => {
			const { type } = response;
			if (type === "getFCMToken") {
				callback && callback(response);
			}
		});

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "getFCMToken",
			});
	}
};
