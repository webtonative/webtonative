import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import {
	WalletResponse,
	WalletSupportedOptions,
	WalletNameOptions,
	WalletAddPassesOptions,
	WalletAddPassesConfig,
	WalletIosMessage,
	WalletAndroidParams,
} from "./types";

const isUrl = (value: string): boolean => /^https?:\/\//i.test(value);

/**
 * Checks whether the device has a wallet available to add passes to.
 * @example Wallet.isSupported({ callback: (res) => console.log(res) })
 */
export const isSupported = (options: WalletSupportedOptions = {}): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback } = options;

		registerCb((response: WalletResponse) => {
			const { type } = response;
			if (type === "isWalletSupported") {
				callback && callback(response);
			}
		});

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

		registerCb((response: WalletResponse) => {
			const { type } = response;
			if (type === "getWalletName") {
				callback && callback(response);
			}
		});

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

		registerCb((response: WalletResponse) => {
			const { type } = response;
			if (type === "addWalletPasses") {
				callback && callback(response);
			}
		});

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

export default { isSupported, getName, addPasses };
