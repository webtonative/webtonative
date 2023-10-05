/**
 * Repository for webtonative javascript sdk. Build your android/ios app from https://webtonative.com.
 * This is in beta phase.
 * @example npm install webtonative
 * import webtonative from "webtonative";
 * const wtn = webtonative();
 */
import { isNativeApp, webToNative, platform, webToNativeIos, registerCb } from "./utills";
export const isAndroidApp = platform === "ANDROID_APP";
export const isIosApp = platform === "IOS_APP";

/**
 * This function hides splash screen
 * @example wtn.hideSplashScreen()
 */
export const hideSplashScreen = () => {
	isNativeApp && webToNative.hideSplashScreen();
};

export const statusBar = (options) => {
	if (isNativeApp) {
		if (isAndroidApp) {
			webToNative.statusBar(JSON.stringify(options));
		} else if (isIosApp) {
			webToNativeIos.postMessage({
				action: "statusBar",
				color: options.color,
				style: options.style,
			});
		}
	}
};

export const downloadFile = (downloadUrl) => {
	if (isNativeApp) {
		if (isAndroidApp) {
		} else if (isIosApp) {
			webToNativeIos.postMessage({
				action: "downloadFile",
				downloadUrl,
			});
		}
	}
};

export const deviceInfo = () => {
	return new Promise((resolve, reject) => {
		registerCb(
			(results) => {
				if (results) {
					resolve(results);
				} else {
					reject({
						err: "Error getting device info",
					});
				}
			},
			{
				key: "deviceInfo",
			}
		);
		if (platform === "ANDROID_APP") {
			webToNative.getDeviceInfo();
		} else if (platform === "IOS_APP") {
			webToNativeIos.postMessage({
				action: "deviceInfo",
			});
		} else {
			reject("This function will work in Native App Powered By WebToNative");
		}
	});
};

export const showInAppReview = () => {
	isNativeApp && webToNative.showInAppReview();
};

export const isDeviceGPSEnabled = (options = {}) => {
	const { callback } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "isDeviceGPSEnabled") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.isLocationServiceEnabled();
	}
};

export const shareLink = ({ url = "" }) => {
	if (url) {
		isAndroidApp && webToNative.openShareIntent(url);
		isIosApp &&
			webToNativeIos.postMessage({
				action: "share",
				url,
			});
	} else {
		throw "url is mandatory";
	}
};

export const openUrlInBrowser = (url = "") => {
	if (url) {
		isAndroidApp && webToNative.openUrlInBrowser(url);
	} else {
		throw "url is mandatory";
	}
};

export const enablePullToRefresh = (status) => {
	isAndroidApp && webToNative.enableSwipeRefresh(status);
};

export const clearAppCache = (reload) => {
	isAndroidApp && webToNative.clearWebViewCache(JSON.stringify({ reload }));
};

export const shareFile = (fileUrl = null, fileExtension = null) => {
	isAndroidApp && webToNative.shareFile(fileUrl, fileExtension);
};

export const closeApp = () => {
	isAndroidApp && webToNative.closeApp();
};

export { platform, isNativeApp };

export default {
	isAndroidApp,
	isIosApp,
	hideSplashScreen,
	statusBar,
	deviceInfo,
	showInAppReview,
	shareLink,
	platform,
	isNativeApp,
	isDeviceGPSEnabled,
	openUrlInBrowser,
	enablePullToRefresh,
	shareFile,
	clearAppCache,
	closeApp
};
