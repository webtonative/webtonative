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
export const isAndroidORIosApp = ["ANDROID_APP", "IOS_APP"].includes(platform);
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

export const downloadBlobFile = ({ fileName, downloadUrl }) => {
	if (["IOS_APP"].includes(platform)) {
		isIosApp &&
			webToNativeIos.postMessage({
				action: "downloadBlobFile",
				fileName,
				url: downloadUrl,
			});
	}
};

export const customFileDownload = ({
	downloadUrl,
	fileName,
	isBlob,
	mimeType,
	cookies,
	userAgent,
	openFileAfterDownload,
}) => {
	if (["ANDROID_APP"].includes(platform)) {
		platform === "ANDROID_APP" &&
			webToNative.downloadFile(
				JSON.stringify({
					url: downloadUrl,
					fileName,
					isBlob,
					mimeType,
					cookies,
					userAgent,
					openFileAfterDownload,
				})
			);
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

export const shareFile = (fileUrl = null, fileExtension = null, text = null) => {
	isAndroidApp && webToNative.shareFile(fileUrl, fileExtension, text);
};

export const closeApp = () => {
	isAndroidApp && webToNative.closeApp();
	isIosApp &&
		webToNativeIos.postMessage({
			action: "closeApp",
		});
};

export const showDateTimePicker = (options) => {
	if (["ANDROID_APP"].includes(platform)) {
		const { callback, showDate, showTime } = options;
		registerCb((response) => {
			const { type } = response;
			if (type === "DATE_TIME_PICKER") {
				callback && callback(response);
			}
		});

		isAndroidApp &&
			webToNative.pickDateTime(
				JSON.stringify({
					showDate,
					showTime,
				})
			);
	}
};

export const printFunction = (options) => {
	if (["ANDROID_APP"].includes(platform)) {
		const { type = "url", url = "" } = options;

		isAndroidApp &&
			webToNative.print(
				JSON.stringify({
					type,
					url,
				})
			);
	}
};

export const nfcSupported = (options) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback } = options;
		registerCb((response) => {
			const { type } = response;
			if (type === "nfcSupported") {
				callback && callback(response);
			}
		});

		isAndroidApp && webToNative.nfcSupported();

		isIosApp &&
			webToNativeIos.postMessage({
				action: "nfcSupported",
			});
	}
};

export const loadOfferCard = (options) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		isAndroidApp && webToNative.showOfferCard(JSON.stringify(options));

		if (options.data) {
			options.data = JSON.stringify(options.data);
		}
		isIosApp && webToNativeIos.postMessage(options);
	}
};

export const addToSiri = (options) => {
	if (["IOS_APP"].includes(platform)) {
		if (options.data) options.data = JSON.stringify(options.data);
		isIosApp && webToNativeIos.postMessage(options);
	}
};

export const appFirstLoad = () => {
	return new Promise((resolve, reject) => {
		registerCb(
			(results) => {
				const { type } = results;
				if (type === "firstCallWhenAppStarted") {
					if (results) {
						resolve(results);
					} else {
						reject({
							err: "Error getting request",
						});
					}
				}
			},
			{
				key: "firstCallWhenAppStarted",
			}
		);
		if (platform === "ANDROID_APP") {
			webToNative.firstCallWhenAppStarted();
		} else if (platform === "IOS_APP") {
			webToNativeIos.postMessage({
				action: "firstCallWhenAppStarted",
			});
		} else {
			reject("This function will work in Native App Powered By WebToNative");
		}
	});
};

export const forceUpdateCookies = () => {
	if (["ANDROID_APP"].includes(platform)) {
		isAndroidApp && webToNative.forceUpdateCookies();
	}
};

export const openAppSettingForPermission = (options) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, values } = options;
		registerCb((response) => {
			const { type, typeValue } = response;
			if (type === "openAppSettingForPermission") {
				callback && callback(response);
			}
		});

		isAndroidApp && webToNative.openAppSettingForPermission(values);

		isIosApp &&
			webToNativeIos.postMessage({
				action: "openAppSettingForPermission",
				values,
			});
	}
};

export const showPermission = (options) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, permission, openAppSetting = false, alertDialogStyle } = options;
		registerCb((response) => {
			const { type, typeValue } = response;
			if (type === "showPermission" || typeValue === "showPermission") {
				callback && callback(response);
			}
		});

		isAndroidApp &&
			webToNative.showPermission(
				JSON.stringify({
					permission,
					openAppSetting,
					alertDialogStyle,
				})
			);

		isIosApp &&
			webToNativeIos.postMessage({
				action: "showPermission",
				permission,
				openAppSetting,
				alertDialogStyle,
			});
	}
};

export const updateAppIcon = (options) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { active = false, iconName = null } = options;

		isAndroidApp &&
			webToNative.updateAppIcon(
				JSON.stringify({
					active,
					iconName,
				})
			);

		isIosApp &&
			webToNativeIos.postMessage({
				action: "updateAppIcon",
				iconName,
				active,
			});
	}
};

export const disableScreenshot = (options) => {
	if (["IOS_APP"].includes(platform)) {
		const { ssKey = false } = options;
		isIosApp &&
			webToNativeIos.postMessage({
				action: "disableScreenshotForPage",
				ssKey,
			});
	}
};

export const customBackHandling = (options) => {
	if (["ANDROID_APP","IOS_APP"].includes(platform)) {
		const { enable=false } = options;
		isAndroidApp && webToNative.customBackHandling(JSON.stringify({enable}));
		isIosApp && webToNativeIos.postMessage({
			"action": "customBackHandling",
			enable
		});
	}
};

export const getSafeArea = (options) => {
	if (["IOS_APP"].includes(platform)) {
		const { callback } = options;
		registerCb((response) => {
			const { type } = response;
			if (type === "getSafeArea") {
				callback && callback(response);
			}
		});

		isIosApp &&
			webToNativeIos.postMessage({
				action: "getSafeArea",
			});
	}
};

export const getAddOnStatus = (options) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, addOnName } = options;
		registerCb((response) => {
			const { type } = response;
			if (type === "getAddOnStatus") {
				callback && callback(response);
			}
		});

		isAndroidApp &&
			webToNative.getAddOnStatus(
				JSON.stringify({
					addOnName,
				})
			);

		isIosApp &&
			webToNativeIos.postMessage({
				action: "getAddOnStatus",
				addOnName,
			});
	}
};

export const checkPermission = (options) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, permissionName } = options;

		registerCb((response) => {
			const { type } = response;
			if (type === "checkPermission") {
				callback && callback(response);
			}
		});

		isAndroidApp && webToNative.checkPermission(JSON.stringify(permissionName));

		isIosApp &&
			webToNativeIos.postMessage({
				action: "checkPermission",
				permissionName,
			});
	}
};

export const setOrientation = (options) => {
	if (["ANDROID_APP"].includes(platform)) {
		const { orientation, forceOrientation = false } = options;

		isAndroidApp &&
			webToNative.setOrientation(
				JSON.stringify({
					orientation,
					forceOrientation,
				})
			);
	}
};

export const hideNativeComponents = (options) => {
	if (isAndroidORIosApp) {
		const { components } = options || {};

		isAndroidApp && webToNative.hideNativeComponents(JSON.stringify(options));
		isIosApp &&
			webToNativeIos.postMessage({
				action: "hideNativeComponents",
				components,
			});
	}
};

export const showNativeComponents = (options) => {
	if (isAndroidORIosApp) {
		const { components } = options || {};

		isAndroidApp && webToNative.checkPermission(JSON.stringify(options));
		isIosApp &&
			webToNativeIos.postMessage({
				action: "showNativeComponents",
				components,
			});
	}
};

export const registerNotification = (options) => {
	if (isAndroidORIosApp) {
		const { callback } = options || {};

		registerCb((response) => {
			const { type } = response;
			if (type === "registerNotification") {
				callback && callback(response);
			}
		});

		isAndroidApp && webToNative.registerNotification();
		isIosApp &&
			webToNativeIos.postMessage({
				action: "registerNotification",
			});
	}
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
	closeApp,
	showDateTimePicker,
	downloadBlobFile,
	customFileDownload,
	printFunction,
	loadOfferCard,
	appFirstLoad,
	addToSiri,
	showPermission,
	forceUpdateCookies,
	updateAppIcon,
	disableScreenshot,
	getSafeArea,
	getAddOnStatus,
	setOrientation,
	checkPermission,
	openAppSettingForPermission,
	customBackHandling,
	hideNativeComponents,
	showNativeComponents,
	registerNotification,
};
