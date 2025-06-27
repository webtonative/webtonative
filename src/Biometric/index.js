import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
/**
 *
 *
 */
export const checkStatus = (options = {}) => {
	const { callback } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "checkBiometricStatus") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
        	webToNative.checkBiometricStatus();

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

		platform === "ANDROID_APP" &&
        	webToNative.saveSecret(secret);

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

		platform === "ANDROID_APP" &&
        	webToNative.deleteSecret();

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "deleteBiometricSecret",
			});
	}
};

export const show = (options = {}) => {
	const { callback, prompt } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "showBiometric") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
        	webToNative.callBiometric(prompt || "Authenticate to continue!");

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "showBiometric",
				prompt: prompt || '',
			});
	}
};

export const biometricAuthWithDismissOnCancel = (options = {}) => {
	const { callback, prompt, isAuthenticationOptional=false } = options;
	if (["ANDROID_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "biometricAuthWithDismissOnCancel") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
        	webToNative.biometricAuthWithDismissOnCancel(JSON.stringify({
				prompt:prompt || "Authenticate to continue!",
				isAuthenticationOptional
			}));

	}
};