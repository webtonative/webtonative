import { isIosApp, isAndroidApp } from "./../index";
import { registerCb, webToNative, webToNativeIos } from "../utills";
import { CallbackFunction } from "../types";

interface ILogin {
	callback?: CallbackFunction;
	scope?: string;
	enableBiometrics?: boolean;
}

export const login = (options: ILogin) => {
	const { callback, ...rest } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "auth0Login") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.auth0Login(JSON.stringify(options));
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "auth0Login",
			...rest,
		});
	}
};

export const logout = (options: { callback?: ILogin["callback"] }) => {
	const { callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "auth0Logout") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.auth0Logout();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "auth0Logout",
		});
	}
};

export const getStatus = (options: { callback?: ILogin["callback"] }) => {
	const { callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "auth0Status") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.auth0Status();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "auth0Status",
		});
	}
};

export const getCredentials = (options: { callback?: ILogin["callback"] }) => {
	const { callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "auth0GetCredentials") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.auth0GetCredentials();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "auth0GetCredentials",
		});
	}
};
export const renew = (options: { refreshToken: string; callback?: ILogin["callback"] }) => {
	const { callback, ...rest } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "auth0Renew") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.auth0Renew(JSON.stringify(rest));
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "auth0Renew",
			...rest,
		});
	}
};
