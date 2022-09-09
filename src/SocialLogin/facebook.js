import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
/**
 * This function handles native facebook login
 * @param {object} options
 * @example wtn.socialLogin.facebook.login({
 *  callback:(data)=>{
 *    console.log(data);
 *  }
 * });
 */
export const login = (options) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, scope } = options;

		registerCb((response) => {
			const { type } = response;
			if (type === "fbLoginToken") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.loginWithFacebook();

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "fbSignIn",
				scope,
			});
	}
};

/**
 * This function handles native facebook logout
 * @param {object} options
 * @example wtn.socialLogin.facebook.logout({
 *  callback:(data)=>{
 *    console.log(data);
 *  }
 * });
 */
export const logout = (options) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, scope } = options;

		registerCb((response) => {
			const { type } = response;
			if (type === "fbLogOut") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.logoutWithFacebook();

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "fbSignOut",
				scope,
			});
	}
};
