import { isIosApp, isAndroidApp } from "./../index";
import { registerCb, webToNative, webToNativeIos } from "../utills";
import { CallbackFunction } from "../types";

interface IClerk {
	callback?: CallbackFunction;
}

const NOT_NATIVE_ERROR = "This function will work in Native App Powered By WebToNative";

/**
 * Registers a one-shot listener for `action`, triggers the native call and resolves with the response.
 */
const callClerk = (action: string, callback?: CallbackFunction): Promise<any> => {
	return new Promise((resolve, reject) => {
		if (!isAndroidApp && !isIosApp) {
			reject(NOT_NATIVE_ERROR);
			return;
		}

		registerCb(
			(response) => {
				if (response.type === action) {
					callback && callback(response);
					resolve(response);
				}
			},
			{ key: action }
		);

		if (isAndroidApp) {
			if (!webToNative[action]) {
				reject(`${action} is not supported in this app version`);
				return;
			}
			webToNative[action]();
		} else if (webToNativeIos) {
			webToNativeIos.postMessage({ action });
		}
	});
};

/**
 * @example wtn.Clerk.initialize().then((res) => console.log(res));
 */
export const initialize = (options: IClerk = {}): Promise<any> => {
	const { callback } = options || {};
	return callClerk("initializeClerk", callback);
};

/**
 * @example wtn.Clerk.login().then((res) => console.log(res));
 */
export const login = (options: IClerk = {}): Promise<any> => {
	const { callback } = options || {};
	return callClerk("loginWithClerkAuth", callback);
};

/**
 * @example wtn.Clerk.logout().then((res) => console.log(res));
 */
export const logout = (options: IClerk = {}): Promise<any> => {
	const { callback } = options || {};
	return callClerk("logoutWithClerkAuth", callback);
};

/**
 * @example wtn.Clerk.getToken().then((res) => console.log(res));
 */
export const getToken = (options: IClerk = {}): Promise<any> => {
	const { callback } = options || {};
	return callClerk("getClerkAuthToken", callback);
};
