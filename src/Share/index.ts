import { isAndroidApp, isIosApp } from "../index";
import { registerCb, webToNative, webToNativeIos } from "../utills";

export const open = (options: ShareOptions): void => {
	const { callback, ...rest } = options || {};

	registerCb((response: ShareResponse) => {
		const { type } = response;
		if (type === "shareOpen") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.shareOpen(JSON.stringify(rest));
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "shareOpen",
			...rest,
		} as ShareIosMessage);
	}
};

export const openIn = (options: ShareOpenInOptions): void => {
	const { callback, platform, ...rest } = options || {};

	registerCb((response: ShareResponse) => {
		const { type } = response;
		if (type === "shareOpenIn") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.shareOpenIn(JSON.stringify({ platform, ...rest }));
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "shareOpenIn",
			platform,
			...rest,
		} as ShareIosMessage);
	}
};

export const isAppAvailable = (options: IsAppAvailableOptions): void => {
	const { callback, platform } = options||{};

	registerCb((response: ShareResponse) => {
		const { type } = response;
		if (type === "isAppAvailable") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.isAppAvailable(JSON.stringify({ platform }));
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "isAppAvailable",
			platform,
		} as ShareIosMessage);
	}
};


// Define types for Share module

export type SharePlatform =
	| "whatsapp"
	| "twitter"
	| "linkedin"
	| "facebook"
	| "instagram"
	| "snapchat";

// Share response interface
export interface ShareResponse {
	type: string;
	status?: "SHARED" | "CANCELLED";
	available?: boolean;
	[key: string]: any;
}

// Share callback function type
export type ShareCallback = (response: ShareResponse) => void;

// Options for share.open()
export interface ShareOptions {
	text?: string;
	url?: string;
	subject?: string;
	image?: string;
	callback?: ShareCallback;
	[key: string]: any;
}

// Options for share.openIn()
export interface ShareOpenInOptions extends ShareOptions {
	platform: SharePlatform;
}

// Options for share.isAppAvailable()
export interface IsAppAvailableOptions {
	platform: SharePlatform;
	callback?: ShareCallback;
	[key: string]: any;
}

// iOS message structure
export interface ShareIosMessage {
	action: string;
	text?: string;
	url?: string;
	subject?: string;
	image?: string;
	platform?: string;
}
