import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import {
	WalletResponse,
	WalletSupportedOptions,
	WalletNameOptions,
	WalletAddPassesOptions,
	WalletAddPassesConfig,
	WalletIosMessage,
	WalletAndroidParams,
	WalletPass,
	WalletGetPassesOptions,
	WalletPassRefOptions,
	WalletReplacePassOptions,
} from "./types";

const isUrl = (value: string): boolean => /^https?:\/\//i.test(value);

/** Drops the keys the caller left out, so the bridge only receives what was asked for. */
const buildPass = (fields: WalletPass): WalletPass => {
	const pass: WalletPass = {};
	(Object.keys(fields) as (keyof WalletPass)[]).forEach((key) => {
		if (fields[key] !== undefined) pass[key] = fields[key];
	});
	return pass;
};

/**
 * Checks whether the device has a wallet available to add passes to.
 * @example Wallet.isSupported({ callback: (res) => console.log(res) })
 */
export const isSupported = (options: WalletSupportedOptions = {}): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback } = options;

		registerCb(
			(response: WalletResponse) => {
				const { type } = response;
				if (type === "isWalletSupported") {
					callback && callback(response);
				}
			},
			{ key: "isWalletSupported" }
		);

		platform === "ANDROID_APP" &&
			webToNative.isWalletSupported &&
			webToNative.isWalletSupported();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "isWalletSupported",
			} as WalletIosMessage);
		}
	}
};

/**
 * Returns the name of the wallet available on the device.
 * @example Wallet.getName({ callback: (res) => console.log(res) })
 */
export const getName = (options: WalletNameOptions = {}): void => {
	if (["ANDROID_APP"].includes(platform)) {
		const { callback } = options;

		registerCb(
			(response: WalletResponse) => {
				const { type } = response;
				if (type === "getWalletName") {
					callback && callback(response);
				}
			},
			{ key: "getWalletName" }
		);

		platform === "ANDROID_APP" && webToNative.getWalletName && webToNative.getWalletName();
	}
};

/**
 * Adds one or more passes to the device wallet.
 * @example Wallet.addPasses({ urls: ["https://example.com/pass.pkpass"] })
 * @example Wallet.addPasses({ base64s: ["<base64>"] })
 */
export const addPasses = (options: WalletAddPassesOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { base64s, urls, passes, callback } = options || {};

		registerCb(
			(response: WalletResponse) => {
				const { type } = response;
				if (type === "addWalletPasses") {
					callback && callback(response);
				}
			},
			{ key: "addWalletPasses" }
		);

		if (platform === "ANDROID_APP") {
			const androidPasses = passes || [...(urls || []), ...(base64s || [])];

			webToNative.addWalletPasses &&
				webToNative.addWalletPasses(
					JSON.stringify({
						config: {
							passes: androidPasses,
						},
					} as WalletAndroidParams)
				);
		}

		if (platform === "IOS_APP" && webToNativeIos) {
			const config: WalletAddPassesConfig = {};
			const iosUrls = [...(urls || []), ...(passes || []).filter(isUrl)];
			const iosBase64s = [...(base64s || []), ...(passes || []).filter((p) => !isUrl(p))];

			if (iosBase64s.length) config.base64s = iosBase64s;
			if (iosUrls.length) config.urls = iosUrls;

			webToNativeIos.postMessage({
				action: "addWalletPasses",
				config,
			} as WalletIosMessage);
		}
	}
};

/**
 * Reads passes already in the wallet — every pass of a type, or one specific pass.
 * iOS only.
 * @example Wallet.getPasses({ passType: "value", callback: (res) => console.log(res) })
 * @example Wallet.getPasses({ passTypeIdentifier: "value", serialNumber: "value" })
 */
export const getPasses = (options: WalletGetPassesOptions = {}): void => {
	if (platform === "IOS_APP" && webToNativeIos) {
		const { passType, passTypeIdentifier, serialNumber, callback } = options;

		registerCb(
			(response: WalletResponse) => {
				const { type } = response;
				if (type === "getWalletPasses") {
					callback && callback(response);
				}
			},
			{ key: "getWalletPasses" }
		);

		webToNativeIos.postMessage({
			action: "getWalletPasses",
			pass: buildPass({ passType, passTypeIdentifier, serialNumber }),
		} as WalletIosMessage);
	}
};

/**
 * Checks whether a pass is already in the wallet, either by identifier or by handing
 * over the pass itself. iOS only.
 * @example Wallet.checkPassExists({ passTypeIdentifier: "value", serialNumber: "value" })
 * @example Wallet.checkPassExists({ url: "https://example.com/pass.pkpass" })
 */
export const checkPassExists = (options: WalletPassRefOptions = {}): void => {
	if (platform === "IOS_APP" && webToNativeIos) {
		const { passTypeIdentifier, serialNumber, base64, url, callback } = options;

		registerCb(
			(response: WalletResponse) => {
				const { type } = response;
				if (type === "checkPassExists") {
					callback && callback(response);
				}
			},
			{ key: "checkPassExists" }
		);

		webToNativeIos.postMessage({
			action: "checkPassExists",
			pass: buildPass({ passTypeIdentifier, serialNumber, base64, url }),
		} as WalletIosMessage);
	}
};

/**
 * Removes a pass from the wallet, either by identifier or by handing over the pass
 * itself. iOS only.
 * @example Wallet.removePass({ passTypeIdentifier: "value", serialNumber: "value" })
 * @example Wallet.removePass({ base64: "<base64>" })
 */
export const removePass = (options: WalletPassRefOptions = {}): void => {
	if (platform === "IOS_APP" && webToNativeIos) {
		const { passTypeIdentifier, serialNumber, base64, url, callback } = options;

		registerCb(
			(response: WalletResponse) => {
				const { type } = response;
				if (type === "removePass") {
					callback && callback(response);
				}
			},
			{ key: "removePass" }
		);

		webToNativeIos.postMessage({
			action: "removePass",
			pass: buildPass({ passTypeIdentifier, serialNumber, base64, url }),
		} as WalletIosMessage);
	}
};

/**
 * Replaces the matching pass already in the wallet with the one given. iOS only.
 * @example Wallet.replacePass({ url: "https://example.com/pass.pkpass" })
 * @example Wallet.replacePass({ base64: "<base64>" })
 */
export const replacePass = (options: WalletReplacePassOptions = {}): void => {
	if (platform === "IOS_APP" && webToNativeIos) {
		const { base64, url, callback } = options;

		registerCb(
			(response: WalletResponse) => {
				const { type } = response;
				if (type === "replacePass") {
					callback && callback(response);
				}
			},
			{ key: "replacePass" }
		);

		webToNativeIos.postMessage({
			action: "replacePass",
			pass: buildPass({ base64, url }),
		} as WalletIosMessage);
	}
};

export default {
	isSupported,
	getName,
	addPasses,
	getPasses,
	checkPassExists,
	removePass,
	replacePass,
};
