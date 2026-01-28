// Define common types used throughout the package

// Platform types
export type Platform = "ANDROID_APP" | "IOS_APP" | "WEBSITE";

// Base response interface for all native responses
export interface BaseResponse {
	type: string;
	[key: string]: any;
}

// Base callback interface for all native callbacks
export interface BaseCallback {
	(response: BaseResponse): void;
}

// Callback function types
export type CallbackFunction = (response: any) => void;

// Register callback options
export interface RegisterCallbackOptions {
	key?: string;
	ignoreDelete?: boolean;
}

// Status bar options
export interface StatusBarOptions {
	color?: string;
	style?: "light" | "dark";
	overlay?: boolean;
}

// Download file options
export interface DownloadBlobFileOptions {
	fileName: string;
	downloadUrl: string;
	shareFileAfterDownload?: boolean;
}

// Custom file download options
export interface CustomFileDownloadOptions {
	downloadUrl: string;
	fileName: string;
	isBlob?: boolean;
	mimeType?: string;
	cookies?: string;
	userAgent?: string;
	openFileAfterDownload?: boolean;
}

// Device info response
export interface DeviceInfoResponse {
	[key: string]: any;
}

// Native interface
export interface WebToNativeInterface {
	getAndroidVersion?: () => string;
	hideSplashScreen?: () => void;
	statusBar?: (options: string) => void;
	downloadFile?: (options: string) => void;
	getDeviceInfo?: () => void;
	showInAppReview?: () => void;
	startScanner?: (options: string) => void;
	androidCBHook?: (results: string) => void;
	androidAdMobCBHook?: (results: string) => void;
	[key: string]: any;
}

// iOS interface
export interface WebToNativeIosInterface {
	postMessage: (message: any) => void;
}
