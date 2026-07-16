import { platform, registerCb, webToNative, webToNativeIos } from "../utills";

/**
 * Initiates Truecaller login for Android and iOS
 * @example
 * truecallerLogin({
 *   callback: (data) => {
 *     console.log(data);
 *   }
 * });
 */

export interface TruecallerLoginOptions {
	callback?: (response: any) => void;
	scope?: string;
}

export const truecallerLogin = (options: TruecallerLoginOptions = {}): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, ...rest } = options;

		registerCb((response) => {
			const { type } = response;
			if (type === "truecallerLogin") {
				callback && callback(response);
			}
		}, { key: "truecallerLogin" });

		if (platform === "ANDROID_APP") {
			webToNative.truecallerLogin && webToNative.truecallerLogin(JSON.stringify(rest));
		}

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "truecallerLogin",
				...rest
			});
		}
	}
};
