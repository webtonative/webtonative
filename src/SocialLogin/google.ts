import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import { SocialLoginOptions, GoogleLoginResponse, GoogleLogoutResponse, GoogleIosMessage } from "./types";

/**
 * This function handles native Google login
 * @param options - Options for Google login
 * @example wtn.socialLogin.google.login({
 *  callback:(data)=>{
 *    console.log(data);
 *  }
 * });
 */
export const login = (options: SocialLoginOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, scope } = options;

		registerCb((response: GoogleLoginResponse) => {
			const { type } = response;
			if (type === "googleLoginToken") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.signInWithGoogle();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "googleSignIn",
				scope,
			} as GoogleIosMessage);
		}
	}
};

/**
 * This function handles native Google logout
 * @param options - Options for Google logout
 * @example wtn.socialLogin.google.logout({
 *  callback:(data)=>{
 *    console.log(data);
 *  }
 * });
 */
export const logout = (options: SocialLoginOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, scope } = options;

		registerCb((response: GoogleLogoutResponse) => {
			const { type } = response;
			if (type === "googleLogOut") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.signOutWithGoogle();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "googleSignOut",
				scope,
			} as GoogleIosMessage);
		}
	}
};