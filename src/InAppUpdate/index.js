import { platform, registerCb, webToNative, webToNativeIos } from "../utills";

export const checkIfAppUpdateAvailable = (options) => {
	if (["ANDROID_APP"].includes(platform)) {
		const { callback } = options;

		registerCb((response) => {
			const { type } = response;
			if (type === "checkIfAppUpdateAvailable") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
			webToNative.checkIfAppUpdateAvailable()
	}
};

export const updateApplication = (options) => {
	if (["ANDROID_APP"].includes(platform)) {

		const { updateType="immediate", callback } = options;

		registerCb((response) => {
			const { type } = response;
			if (type === "updateApplication") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
			webToNative.updateApplication(updateType)
	}
}