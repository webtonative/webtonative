import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import { BiometricOptions, BiometricResponse, BiometricIosMessage, BiometricAuthOptions } from "./types";

/**
 * Checks the status of biometric authentication
 * @param options - Options for checking biometric status
 */
export const checkStatus = (options: BiometricOptions = {}): void => {
	const { callback } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response: BiometricResponse) => {
			const { type } = response;
			if (type === "checkBiometricStatus") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
        	webToNative.checkBiometricStatus();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "checkBiometricStatus",
			} as BiometricIosMessage);
		}
	}
};

/**
 * Saves a secret using biometric authentication
 * @param options - Options for saving biometric secret
 */
export const saveSecret = (options: BiometricOptions = {}): void => {
	const { callback, secret } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response: BiometricResponse) => {
			const { type } = response;
			if (type === "saveBiometricSecret") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
        	webToNative.saveSecret(secret);

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "saveBiometricSecret",
				secret
			} as BiometricIosMessage);
		}
	}
};

/**
 * Deletes a saved biometric secret
 * @param options - Options for deleting biometric secret
 */
export const deleteSecret = (options: BiometricOptions = {}): void => {
	const { callback } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response: BiometricResponse) => {
			const { type } = response;
			if (type === "deleteBiometricSecret") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
        	webToNative.deleteSecret();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "deleteBiometricSecret",
			} as BiometricIosMessage);
		}
	}
};

/**
 * Shows biometric authentication prompt
 * @param options - Options for showing biometric prompt
 */
export const show = (options: BiometricOptions = {}): void => {
	const { callback, prompt } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response: BiometricResponse) => {
			const { type } = response;
			if (type === "showBiometric") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
        	webToNative.callBiometric(prompt || "Authenticate to continue!");

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "showBiometric",
				prompt: prompt || '',
			} as BiometricIosMessage);
		}
	}
};

/**
 * Shows biometric authentication with dismiss on cancel (Android only)
 * @param options - Options for biometric authentication with dismiss on cancel
 */
export const biometricAuthWithDismissOnCancel = (options: BiometricOptions = {}): void => {
	const { callback, prompt, isAuthenticationOptional = false } = options;
	if (["ANDROID_APP"].includes(platform)) {
		registerCb((response: BiometricResponse) => {
			const { type } = response;
			if (type === "biometricAuthWithDismissOnCancel") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
        	webToNative.biometricAuthWithDismissOnCancel(JSON.stringify({
				prompt: prompt || "Authenticate to continue!",
				isAuthenticationOptional
			} as BiometricAuthOptions));
	}
};