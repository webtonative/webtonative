import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import { CheckUpdateOptions, UpdateApplicationOptions, InAppUpdateResponse } from "./types";

/**
 * Checks if an app update is available (Android only)
 * @param options - Options for checking app update
 */
export const checkIfAppUpdateAvailable = (options: CheckUpdateOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback } = options;

		registerCb((response: InAppUpdateResponse) => {
			const { type } = response;
			if (type === "checkIfAppUpdateAvailable") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.checkIfAppUpdateAvailable();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "checkIfAppUpdateAvailable",
			});
		}
	}
};

/**
 * Updates the application (Android only)
 * @param options - Options for updating the application
 */
export const updateApplication = (options: UpdateApplicationOptions): void => {
	if (["ANDROID_APP"].includes(platform)) {
		const { updateType = "immediate", callback } = options;

		registerCb((response: InAppUpdateResponse) => {
			const { type } = response;
			if (type === "updateApplication") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.updateApplication(updateType);
	}
};

export const showInAppUpdateUI = (options: CheckUpdateOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback } = options;

		registerCb((response: InAppUpdateResponse) => {
			const { type } = response;
			if (type === "showInAppUpdateUI") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.showInAppUpdateUI();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "showInAppUpdateUI",
			});
		}
	}
};
