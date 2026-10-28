import { isAndroidApp, isIosApp } from "../index";
import { registerCb, webToNative, webToNativeIos } from "../utills";

const NOT_NATIVE_ERROR = "This function will work in Native App Powered By WebToNative";

/**
 * Registers a one-shot listener for `action`, triggers the native call and resolves with the response.
 * `data` is JSON-stringified for the Android bridge and spread into the iOS postMessage payload.
 */
const callShare = (
	action: string,
	callback: ShareCallback | undefined,
	data: Omit<ShareIosMessage, "action">
): Promise<ShareResponse> => {
	return new Promise((resolve, reject) => {
		if (!isAndroidApp && !isIosApp) {
			reject(NOT_NATIVE_ERROR);
			return;
		}

		registerCb(
			(response: ShareResponse) => {
				if (response.type === action) {
					callback && callback(response);
					resolve(response);
				}
			},
			{ key: action }
		);

		if (isAndroidApp) {
			if (!webToNative[action]) {
				reject(`${action} is not supported in this app version`);
				return;
			}
			webToNative[action](JSON.stringify(data));
		} else if (webToNativeIos) {
			webToNativeIos.postMessage({ action, ...data } as ShareIosMessage);
		}
	});
};

/**
 * Opens the native share sheet.
 * @example
 * wtn.Share.open({ text: "Hello", url: "https://example.com" }).then((res) => console.log(res.status));
 */
export const open = (options: ShareOptions): Promise<ShareResponse> => {
	const { callback, ...rest } = options || {};
	return callShare("shareOpen", callback, rest);
};

/**
 * Shares directly into a specific app.
 * @example
 * wtn.Share.openIn({ platform: "whatsapp", text: "Hello" }).then((res) => console.log(res.status));
 */
export const openIn = (options: ShareOpenInOptions): Promise<ShareResponse> => {
	const { callback, platform, ...rest } = options || ({} as ShareOpenInOptions);
	return callShare("shareOpenIn", callback, { platform, ...rest });
};

/**
 * Checks whether a share target app is installed.
 * @example
 * wtn.Share.isAppAvailable({ platform: "instagram" }).then((res) => console.log(res.available));
 */
export const isAppAvailable = (options: IsAppAvailableOptions): Promise<ShareResponse> => {
	const { callback, platform } = options || ({} as IsAppAvailableOptions);
	return callShare("isAppAvailable", callback, { platform });
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
