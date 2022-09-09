import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
/**
 *
 *
 */
export const getPermissionStatus = (options = {}) => {
	const { callback } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			console.log(response);
			const { type } = response;
			if (type === "contactPermissionStatus") {
				callback && callback(response);
			}
		});

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "askUserForContactPermission",
			});
	}
};

/**
 *
 *
 */
export const getAll = (options = {}) => {
	const { callback } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			console.log(response);
			if (type === "contactDetails") {
				callback && callback(response);
			}
		});

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "getUserContactDetails",
			});
	}
};
