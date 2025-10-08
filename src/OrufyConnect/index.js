import { isIosApp, isAndroidApp } from "./../index";
import { registerCb, webToNative, webToNativeIos } from "../utills";

export const onUnreadChatCountsChange = (options) => {
	const { callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "onUnreadChatCountsChange") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.onUnreadChatCountsChange();
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "onUnreadChatCountsChange",
		});
	}
};

export const widgetLogin = (data) => {
	if (isAndroidApp) {
		webToNative.widgetLogin(JSON.stringify(data));
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "widgetLogin",
			data,
		});
	}
};

export const setUserDetails = (data) => {
	if (isAndroidApp) {
		webToNative.setUserDetails(JSON.stringify(data));
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "setUserDetails",
			data,
		});
	}
};

export const widgetLogout = () => {
	if (isAndroidApp) {
		webToNative.widgetLogout();
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "widgetLogout",
		});
	}
};

export const isInitializationDone = (options) => {
	const { callback } = options || {};
	registerCb((response) => {
		const { type } = response;
		if (type === "isInitializationDone") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.isInitializationDone();
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "isInitializationDone",
		});
	}
};

export const setAppId = (options) => {
	const { callback, appId } = options || {};
	registerCb((response) => {
		const { type } = response;
		if (type === "setAppId") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.setAppId(JSON.stringify(appId));
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "setAppId",
			appId,
		});
	}
};

export const setExternalUserid = (options) => {
	const { callback, externalUserId } = options || {};
	registerCb((response) => {
		const { type } = response;
		if (type === "setExternalUserid") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.setExternalUserid(JSON.stringify(externalUserId));
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "setExternalUserid",
			externalUserId,
		});
	}
};

export const isUserLoggedIn = (options) => {
	const { callback } = options || {};
	registerCb((response) => {
		const { type } = response;
		if (type === "isUserLoggedIn") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.isUserLoggedIn();
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "isUserLoggedIn",
		});
	}
};

export const getUser = (options) => {
	const { callback } = options || {};
	registerCb((response) => {
		const { type } = response;
		if (type === "getUser") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.getUser();
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "getUser",
		});
	}
};

export const setWidgetConfig = (options) => {
	if (isAndroidApp) {
		webToNative.setWidgetConfig(JSON.stringify(options));
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "setWidgetConfig",
			data: options,
		});
	}
};

export const getUnreadChatsCount = (options) => {
	const { callback } = options || {};
	registerCb((response) => {
		const { type } = response;
		if (type === "getUnreadChatsCount") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.getUnreadChatsCount();
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "getUnreadChatsCount",
		});
	}
};

export const sendChatMessage = (options) => {
	const { callback } = options || {};
	registerCb((response) => {
		const { type } = response;
		if (type === "sendChatMessage") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.sendChatMessage(JSON.stringify(options));
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "sendChatMessage",
			data: options,
		});
	}
};
