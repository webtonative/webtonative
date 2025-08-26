import { platform, webToNative, webToNativeIos, registerCb } from "../../utills";
import { 
	FirebaseTopicSubscriptionOptions,
	FirebaseTopicUnsubscriptionOptions,
	FirebaseFCMTokenOptions,
	FirebaseFCMTokenResponse,
	FirebaseMessagingIosMessage
} from "../types";

/**
 * Subscribes to a Firebase Cloud Messaging topic
 * @param options - Options for topic subscription
 */
export const subscribe = (options: FirebaseTopicSubscriptionOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { toTopic } = options;

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "firebaseSubscribeToTopic",
				topic: toTopic,
			} as FirebaseMessagingIosMessage);
		}

		platform === "ANDROID_APP" && webToNative.subscribeToTopic(toTopic);
	}
};

/**
 * Unsubscribes from a Firebase Cloud Messaging topic
 * @param options - Options for topic unsubscription
 */
export const unsubscribe = (options: FirebaseTopicUnsubscriptionOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { fromTopic } = options;

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "firebaseUnsubscribeFromTopic",
				topic: fromTopic,
			} as FirebaseMessagingIosMessage);
		}

		platform === "ANDROID_APP" && webToNative.unsubscribeFromTopic(fromTopic);
	}
};

/**
 * Gets the Firebase Cloud Messaging token
 * @param options - Options for getting FCM token
 */
export const getFCMToken = (options: FirebaseFCMTokenOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback } = options;
		registerCb((response: FirebaseFCMTokenResponse) => {
			const { type } = response;
			if (type === "getFCMToken") {
				if (platform === "ANDROID_APP") {
					response.token = response.fcm_registration_token;
				}
				callback && callback(response);
			}
		});

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "getFCMToken",
			} as FirebaseMessagingIosMessage);
		}

		platform === "ANDROID_APP" && webToNative.getRegistrationToken();
	}
};