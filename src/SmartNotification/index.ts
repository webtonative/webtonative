import { platform, webToNative, webToNativeIos, registerCb } from "../utills";
import { BaseResponse } from "../types";

interface SmartNotificationTrackedEventOptions {
	event?: string;
	callback?: (response: BaseResponse) => void;
}

export const addTrackedEvent = (
	options: SmartNotificationTrackedEventOptions
): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { event,  callback } = options;

		registerCb((response: BaseResponse) => {
			const { type } = response;
			if (type === "addSmartNotificationTrackedEvent") {
				callback && callback(response);
			}
		});

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "addSmartNotificationTrackedEvent",
				event,
			});
		}

		platform === "ANDROID_APP" &&
			webToNative.addSmartNotificationTrackedEvent &&
			webToNative.addSmartNotificationTrackedEvent(JSON.stringify(event));
	}
};
