import { isIosApp, isAndroidApp } from "./../index";
import { registerCb, webToNative, webToNativeIos } from "../utills";
import { CallbackFunction } from "../types";

interface IClerk {
	callback?: CallbackFunction;
}

export const initialize = (options: IClerk = {}) => {
	const { callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "initializeClerk") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.initializeClerk && webToNative.initializeClerk();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "initializeClerk",
		});
	}
};

export const login = (options: IClerk = {}) => {
	const { callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "loginWithClerkAuth") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.loginWithClerkAuth && webToNative.loginWithClerkAuth();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "loginWithClerkAuth",
		});
	}
};

export const logout = (options: IClerk = {}) => {
	const { callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "logoutWithClerkAuth") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.logoutWithClerkAuth && webToNative.logoutWithClerkAuth();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "logoutWithClerkAuth",
		});
	}
};

export const getToken = (options: IClerk = {}) => {
	const { callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "getClerkAuthToken") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.getClerkAuthToken && webToNative.getClerkAuthToken();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "getClerkAuthToken",
		});
	}
};
