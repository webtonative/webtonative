import { platform, registerCb, webToNativeIos } from "../utills";
/**
 *
 *
 */
export const status = (options = {}) => {
	const { callback } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "checkBiometricStatus") {
				callback && callback(response);
			}
		});

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "checkBiometricStatus",
			});
	}
};


export const saveSecret = (options = {}) => {
	const { callback, secret } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "saveBiometricSecret") {
				callback && callback(response);
			}
		});

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "saveBiometricSecret",
				secret
			});
	}
};


export const deleteSecret = (options = {}) => {
	const { callback } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "deleteBiometricSecret") {
				callback && callback(response);
			}
		});

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "deleteBiometricSecret",
			});
	}
};

export const show = (options = {}) => {
	const { callback, prompt, callbackUrl } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "showBiometric") {
				callback && callback(response);
			}
		});

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "showBiometric",
				prompt: prompt || '',
				callbackUrl
			});
	}
};
