import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
/**
 *
 *
 */
/* export const checkNotificationPermission = (options = {}) => {
	const { callback } = options;
	if (["ANDROID_APP","IOS_APP"].includes(platform)) {
		registerCb((response) => {
			//console.log(response);
			const { type } = response;
			if (type === "checkNotificationPermission") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.checkNotificationPermission();

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "checkNotificationPermission",
			});
	}
}; */

/**
 *
 *
 */
export const openAppNotificationPage = () => {
	if (["ANDROID_APP","IOS_APP"].includes(platform)) {

		platform === "ANDROID_APP" && webToNative.openAppNotificationPage();

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "openAppNotificationPage",
			});
	}
};
