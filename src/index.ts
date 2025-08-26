/**
 * Repository for webtonative javascript sdk. Build your android/ios app from https://webtonative.com.
 * This is in beta phase.
 * @example npm install webtonative
 * import webtonative from "webtonative";
 * const wtn = webtonative();
 */
import { isNativeApp, webToNative, platform, webToNativeIos, registerCb } from "./utills";
import { StatusBarOptions, DownloadBlobFileOptions, CustomFileDownloadOptions } from "./types";

export const isAndroidApp: boolean = platform === "ANDROID_APP";
export const isIosApp: boolean = platform === "IOS_APP";

/**
 * This function hides splash screen
 * @example wtn.hideSplashScreen()
 */
export const hideSplashScreen = (): void => {
	isNativeApp && webToNative.hideSplashScreen && webToNative.hideSplashScreen();
};

export const statusBar = (options: StatusBarOptions): void => {
	if (isNativeApp) {
		if (isAndroidApp) {
			webToNative.statusBar && webToNative.statusBar(JSON.stringify(options));
		} else if (isIosApp) {
			webToNativeIos && webToNativeIos.postMessage({
				action: "statusBar",
				color: options.color,
				style: options.style,
			});
		}
	}
};

export const downloadFile = (downloadUrl: string): void => {
	if (isNativeApp) {
		if (isAndroidApp) {
			// Android implementation
		} else if (isIosApp) {
			webToNativeIos && webToNativeIos.postMessage({
				action: "downloadFile",
				downloadUrl,
			});
		}
	}
};

export const downloadBlobFile = ({fileName, downloadUrl}: DownloadBlobFileOptions): void => {
	if (["IOS_APP"].includes(platform)) {
		isIosApp && webToNativeIos && webToNativeIos.postMessage({
			action: "downloadBlobFile",
			fileName,
			url: downloadUrl,
		});
	}
};

export const customFileDownload = ({downloadUrl, fileName, isBlob, mimeType, cookies, userAgent, openFileAfterDownload}: CustomFileDownloadOptions): void => {
	if (["ANDROID_APP"].includes(platform)) {
		platform === "ANDROID_APP" && webToNative.downloadFile && webToNative.downloadFile(JSON.stringify({
			url: downloadUrl,
			fileName,
			isBlob,
			mimeType,
			cookies,
			userAgent,
			openFileAfterDownload
		}))
	}
}

export const deviceInfo = (): Promise<any> => {
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
			webToNative.getDeviceInfo && webToNative.getDeviceInfo();
		} else if (platform === "IOS_APP") {
			webToNativeIos && webToNativeIos.postMessage({
				action: "deviceInfo",
			});
		} else {
			reject("This function will work in Native App Powered By WebToNative");
		}
	});
};

export const showInAppReview = (): void => {
	isNativeApp && webToNative.showInAppReview && webToNative.showInAppReview();
};

// Export all other functions from the original file