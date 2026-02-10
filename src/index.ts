/**
 * Repository for webtonative javascript sdk. Build your android/ios app from https://webtonative.com.
 * This is in beta phase.
 * @example npm install webtonative
 * import webtonative from "webtonative";
 * const wtn = webtonative();
 */
import { isNativeApp, webToNative, platform, webToNativeIos, registerCb } from "./utills";
import {
	StatusBarOptions,
	DownloadBlobFileOptions,
	CustomFileDownloadOptions,
	BaseResponse,
} from "./types";

export const isAndroidApp: boolean = platform === "ANDROID_APP";
export const isIosApp: boolean = platform === "IOS_APP";
export const isAndroidORIosApp: boolean = ["ANDROID_APP", "IOS_APP"].includes(platform);

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
			webToNativeIos &&
				webToNativeIos.postMessage({
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
			webToNativeIos &&
				webToNativeIos.postMessage({
					action: "downloadFile",
					downloadUrl,
				});
		}
	}
};

export const downloadBlobFile = ({
	fileName,
	downloadUrl,
	shareFileAfterDownload = true,
	openFileAfterDownload = false,
}: DownloadBlobFileOptions): void => {
	if (["IOS_APP"].includes(platform)) {
		isIosApp &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "downloadBlobFile",
				fileName,
				url: downloadUrl,
				shareFileAfterDownload,
				openFileAfterDownload,
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
}: CustomFileDownloadOptions): void => {
	if (["ANDROID_APP"].includes(platform)) {
		platform === "ANDROID_APP" &&
			webToNative.downloadFile &&
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
			webToNativeIos &&
				webToNativeIos.postMessage({
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

interface GPSEnabledOptions {
	callback?: (response: BaseResponse) => void;
}

export const isDeviceGPSEnabled = (options: GPSEnabledOptions = {}): void => {
	const { callback } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response: BaseResponse) => {
			const { type } = response;
			if (type === "isDeviceGPSEnabled") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
			webToNative.isLocationServiceEnabled &&
			webToNative.isLocationServiceEnabled();
	}
};

interface ShareLinkOptions {
	url: string;
}

export const shareLink = ({ url = "" }: ShareLinkOptions): void => {
	if (url) {
		isAndroidApp && webToNative.openShareIntent && webToNative.openShareIntent(url);
		isIosApp &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "share",
				url,
			});
	} else {
		throw "url is mandatory";
	}
};

export const openUrlInBrowser = (url: string = ""): void => {
	if (url) {
		isAndroidApp && webToNative.openUrlInBrowser && webToNative.openUrlInBrowser(url);
	} else {
		throw "url is mandatory";
	}
};

export const enablePullToRefresh = (status: boolean): void => {
	isAndroidApp && webToNative.enableSwipeRefresh && webToNative.enableSwipeRefresh(status);
};

export const clearAppCache = (reload: boolean): void => {
	isAndroidApp &&
		webToNative.clearWebViewCache &&
		webToNative.clearWebViewCache(JSON.stringify({ reload }));
};

export const shareFile = (
	fileUrl: string | null = null,
	fileExtension: string | null = null,
	text: string | null = null
): void => {
	isAndroidApp && webToNative.shareFile && webToNative.shareFile(fileUrl, fileExtension, text);
};

export const closeApp = (): void => {
	isAndroidApp && webToNative.closeApp && webToNative.closeApp();
	isIosApp &&
		webToNativeIos &&
		webToNativeIos.postMessage({
			action: "closeApp",
		});
};

interface DateTimePickerOptions {
	callback?: (response: BaseResponse) => void;
	showDate?: boolean;
	showTime?: boolean;
}

export const showDateTimePicker = (options: DateTimePickerOptions): void => {
	if (["ANDROID_APP"].includes(platform)) {
		const { callback, showDate, showTime } = options;
		registerCb((response: BaseResponse) => {
			const { type } = response;
			if (type === "DATE_TIME_PICKER") {
				callback && callback(response);
			}
		});

		isAndroidApp &&
			webToNative.pickDateTime &&
			webToNative.pickDateTime(
				JSON.stringify({
					showDate,
					showTime,
				})
			);
	}
};

interface PrintFunctionOptions {
	type?: string;
	url?: string;
}

export const printFunction = (options: PrintFunctionOptions): void => {
	if (["ANDROID_APP"].includes(platform)) {
		const { type = "url", url = "" } = options;

		isAndroidApp &&
			webToNative.print &&
			webToNative.print(
				JSON.stringify({
					type,
					url,
				})
			);
	}
};

interface NFCSupportedOptions {
	callback?: (response: BaseResponse) => void;
}

export const nfcSupported = (options: NFCSupportedOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback } = options;
		registerCb((response: BaseResponse) => {
			const { type } = response;
			if (type === "nfcSupported") {
				callback && callback(response);
			}
		});

		isAndroidApp && webToNative.nfcSupported && webToNative.nfcSupported();

		isIosApp &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "nfcSupported",
			});
	}
};

interface LoadOfferCardOptions {
	data?: any;
	[key: string]: any;
}

export const loadOfferCard = (options: LoadOfferCardOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		isAndroidApp && webToNative.showOfferCard && webToNative.showOfferCard(JSON.stringify(options));

		if (options.data) {
			options.data = JSON.stringify(options.data);
		}
		isIosApp && webToNativeIos && webToNativeIos.postMessage(options);
	}
};

interface AddToSiriOptions {
	data?: any;
	[key: string]: any;
}

export const addToSiri = (options: AddToSiriOptions): void => {
	if (["IOS_APP"].includes(platform)) {
		if (options.data) options.data = JSON.stringify(options.data);
		isIosApp && webToNativeIos && webToNativeIos.postMessage(options);
	}
};

export const appFirstLoad = (): Promise<any> => {
	return new Promise((resolve, reject) => {
		registerCb(
			(results: BaseResponse) => {
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
			webToNative.firstCallWhenAppStarted && webToNative.firstCallWhenAppStarted();
		} else if (platform === "IOS_APP") {
			webToNativeIos &&
				webToNativeIos.postMessage({
					action: "firstCallWhenAppStarted",
				});
		} else {
			reject("This function will work in Native App Powered By WebToNative");
		}
	});
};

export const forceUpdateCookies = (): void => {
	if (["ANDROID_APP"].includes(platform)) {
		isAndroidApp && webToNative.forceUpdateCookies && webToNative.forceUpdateCookies();
	}
};

interface OpenAppSettingForPermissionOptions {
	callback?: (response: BaseResponse) => void;
	values?: any;
}

export const openAppSettingForPermission = (options: OpenAppSettingForPermissionOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, values } = options;
		registerCb((response: BaseResponse) => {
			const { type, typeValue } = response;
			if (type === "openAppSettingForPermission") {
				callback && callback(response);
			}
		});

		isAndroidApp &&
			webToNative.openAppSettingForPermission &&
			webToNative.openAppSettingForPermission(values);

		isIosApp &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "openAppSettingForPermission",
				values,
			});
	}
};

interface ShowPermissionOptions {
	callback?: (response: BaseResponse) => void;
	permission?: string;
	openAppSetting?: boolean;
	alertDialogStyle?: any;
}

export const showPermission = (options: ShowPermissionOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, permission, openAppSetting = false, alertDialogStyle } = options;
		registerCb((response: BaseResponse) => {
			const { type, typeValue } = response;
			if (type === "showPermission" || typeValue === "showPermission") {
				callback && callback(response);
			}
		});

		isAndroidApp &&
			webToNative.showPermission &&
			webToNative.showPermission(
				JSON.stringify({
					permission,
					openAppSetting,
					alertDialogStyle,
				})
			);

		isIosApp &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "showPermission",
				permission,
				openAppSetting,
				alertDialogStyle,
			});
	}
};

interface UpdateAppIconOptions {
	active?: boolean;
	iconName?: string | null;
}

export const updateAppIcon = (options: UpdateAppIconOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { active = false, iconName = null } = options;

		isAndroidApp &&
			webToNative.updateAppIcon &&
			webToNative.updateAppIcon(
				JSON.stringify({
					active,
					iconName,
				})
			);

		isIosApp &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "updateAppIcon",
				iconName,
				active,
			});
	}
};

interface DisableScreenshotOptions {
	ssKey?: boolean;
}

export const disableScreenshot = (options: DisableScreenshotOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { ssKey = false } = options;

		isAndroidApp && webToNative.disableScreenshotForPage?.(ssKey);

		isIosApp &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "disableScreenshotForPage",
				ssKey,
			});
	}
};

interface CustomBackHandlingOptions {
	enable?: boolean;
}

export const customBackHandling = (options: CustomBackHandlingOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { enable = false } = options;
		isAndroidApp &&
			webToNative.customBackHandling &&
			webToNative.customBackHandling(JSON.stringify({ enable }));
		isIosApp &&
			webToNativeIos &&
			webToNativeIos?.postMessage({
				action: "customBackHandling",
				enable,
			});
	}
};

interface GetSafeAreaOptions {
	callback?: (response: BaseResponse) => void;
}

export const getSafeArea = (options: GetSafeAreaOptions): void => {
	if (["IOS_APP"].includes(platform)) {
		const { callback } = options;
		registerCb((response: BaseResponse) => {
			const { type } = response;
			if (type === "getSafeArea") {
				callback && callback(response);
			}
		});

		isIosApp &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "getSafeArea",
			});
	}
};

interface GetAddOnStatusOptions {
	callback?: (response: BaseResponse) => void;
	addOnName?: string;
}

export const getAddOnStatus = (options: GetAddOnStatusOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, addOnName } = options;
		registerCb((response: BaseResponse) => {
			const { type } = response;
			if (type === "getAddOnStatus") {
				callback && callback(response);
			}
		});

		isAndroidApp &&
			webToNative.getAddOnStatus &&
			webToNative.getAddOnStatus(
				JSON.stringify({
					addOnName,
				})
			);

		isIosApp &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "getAddOnStatus",
				addOnName,
			});
	}
};

interface CheckPermissionOptions {
	callback?: (response: BaseResponse) => void;
	permissionName?: string[];
}

export const checkPermission = (options: CheckPermissionOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, permissionName } = options;

		registerCb((response: BaseResponse) => {
			const { type } = response;
			if (type === "checkPermission") {
				callback && callback(response);
			}
		});

		isAndroidApp &&
			webToNative.checkPermission &&
			webToNative.checkPermission(JSON.stringify(permissionName));

		isIosApp &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "checkPermission",
				permissionName,
			});
	}
};

interface SetOrientationOptions {
	orientation?: string;
	forceOrientation?: boolean;
}

export const setOrientation = (options: SetOrientationOptions): void => {
	if (["ANDROID_APP"].includes(platform)) {
		const { orientation, forceOrientation = false } = options;

		isAndroidApp &&
			webToNative.setOrientation &&
			webToNative.setOrientation(
				JSON.stringify({
					orientation,
					forceOrientation,
				})
			);
	}
};

interface NativeComponentsOptions {
	components?: string[];
}

export const hideNativeComponents = (options?: NativeComponentsOptions): void => {
	if (isAndroidORIosApp) {
		const { components } = options || {};

		isAndroidApp &&
			webToNative.hideNativeComponents &&
			webToNative.hideNativeComponents(JSON.stringify(options));
		isIosApp &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "hideNativeComponents",
				components,
			});
	}
};

export const showNativeComponents = (options?: NativeComponentsOptions): void => {
	if (isAndroidORIosApp) {
		const { components } = options || {};

		isAndroidApp &&
			webToNative.showNativeComponents &&
			webToNative.showNativeComponents(JSON.stringify(options));
		isIosApp &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "showNativeComponents",
				components,
			});
	}
};

interface RegisterNotificationOptions {
	callback?: (response: BaseResponse) => void;
}

export const registerNotification = (options?: RegisterNotificationOptions): void => {
	if (isAndroidORIosApp) {
		const { callback } = options || {};

		registerCb((response: BaseResponse) => {
			const { type } = response;
			if (type === "registerNotification") {
				callback && callback(response);
			}
		});

		isAndroidApp && webToNative.registerNotification && webToNative.registerNotification();
		isIosApp &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "registerNotification",
			});
	}
};

interface IOptions {
	color?: string;
}
export const setNavigationBarColor = (options: IOptions = {}): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "ANDROID_APP" && webToNative.setNavigationBarColor(JSON.stringify(options));

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setNavigationBarColor",
				options,
			});
		}
	}
};

interface IPinchToZoom {
	state?: boolean;
}
export const pinchToZoom = (options: IPinchToZoom = {}): void => {
	const { state = false } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "ANDROID_APP" && webToNative.pinchToZoom(state);

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "pinchToZoom",
				state,
			});
		}
	}
};

interface IShareMediaShare {
	platform?: string;
	type?: string;
	extension?: string;
	text?: string;
	imageUrl?: string;
}
export const socialMediaShare = (options: IShareMediaShare = {}): void => {
	if (["ANDROID_APP"].includes(platform)) {
		platform === "ANDROID_APP" && webToNative.socialMediaShare(JSON.stringify(options));
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
	setNavigationBarColor,
	pinchToZoom,
	socialMediaShare,
};
