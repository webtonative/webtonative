import { platform, registerCb, webToNative, webToNativeIos } from "../../utills";
import {
	SocialLoginOptions,
	FacebookLoginResponse,
	FacebookLogoutResponse,
	FacebookIosMessage,
} from "../types";

/**
 * This function handles native facebook login
 * @param options - Options for Facebook login
 * @example wtn.socialLogin.facebook.login({
 *  callback:(data)=>{
 *    console.log(data);
 *  }
 * });
 */
export const login = (options: SocialLoginOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, scope } = options;

		registerCb((response: FacebookLoginResponse) => {
			const { type } = response;
			if (type === "fbLoginToken") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.loginWithFacebook();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "fbSignIn",
				scope,
			} as FacebookIosMessage);
		}
	}
};

/**
 * This function handles native facebook logout
 * @param options - Options for Facebook logout
 * @example wtn.socialLogin.facebook.logout({
 *  callback:(data)=>{
 *    console.log(data);
 *  }
 * });
 */
export const logout = (options: SocialLoginOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, scope } = options;

		registerCb((response: FacebookLogoutResponse) => {
			const { type } = response;
			if (type === "fbLogOut") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.logoutWithFacebook();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "fbSignOut",
				scope,
			} as FacebookIosMessage);
		}
	}
};
