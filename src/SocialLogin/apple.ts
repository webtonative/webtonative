import { platform, registerCb, webToNativeIos } from "../utills";
import { SocialLoginOptions, AppleLoginResponse, AppleIosMessage } from "./types";

/**
 * This function handles native Apple login
 * @param options - Options for Apple login
 * @example wtn.socialLogin.apple.login({
 *  callback:(data)=>{
 *    console.log(data);
 *  }
 * });
 */
export const login = (options: SocialLoginOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, scope } = options;

		registerCb((response: AppleLoginResponse) => {
			const { type } = response;
			if (type === "appleLoginToken") {
				callback && callback(response);
			}
		});
		
		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "appleSignIn",
				scope,
			} as AppleIosMessage);
		}
	}
};