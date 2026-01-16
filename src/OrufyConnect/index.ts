import { isIosApp, isAndroidApp } from "../index";
import { registerCb, webToNative, webToNativeIos } from "../utills";

type ICb = { callback?: (response: { type: string } & Record<string, any>) => void } & Record<
	string,
	any
>;

export const onUnreadChatCountsChange = (options?: ICb) => {
	const { callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "onUnreadChatCountsChange") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.onUnreadChatCountsChange();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "onUnreadChatCountsChange",
		});
	}
};

export const openConnectWidget = (data?: ICb & { chatId?: string }) => {
	const { callback, ...rest } = data || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "openConnectWidget") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.openConnectWidget(JSON.stringify({ data: rest }));
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "openConnectWidget",
			data: rest,
		});
	}
};

export const widgetLogin = (data?: Record<string, any>) => {
	if (isAndroidApp) {
		webToNative.widgetLogin(JSON.stringify({ data }));
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "widgetLogin",
			data,
		});
	}
};

export const setUserDetails = (data?: Record<string, any>) => {
	if (isAndroidApp) {
		webToNative.setUserDetails(JSON.stringify({ data }));
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "setUserDetails",
			data,
		});
	}
};

export const widgetLogout = () => {
	if (isAndroidApp) {
		webToNative.widgetLogout();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "widgetLogout",
		});
	}
};

export const isInitializationDone = (options?: ICb) => {
	const { callback } = options || {};
	registerCb((response) => {
		const { type } = response;
		if (type === "isInitializationDone") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.isInitializationDone();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "isInitializationDone",
		});
	}
};

export const setAppId = (options: ICb & { appId: string }) => {
	const { callback, appId } = options || {};
	registerCb((response) => {
		const { type } = response;
		if (type === "setAppId") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.setAppId(JSON.stringify({ data: appId }));
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "setAppId",
			appId,
		});
	}
};

export const setExternalUserid = (options: ICb & { externalUserId: string }) => {
	const { callback, externalUserId } = options || {};
	registerCb((response) => {
		const { type } = response;
		if (type === "setExternalUserid") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.setExternalUserid(JSON.stringify({ data: externalUserId }));
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "setExternalUserid",
			externalUserId,
		});
	}
};

export const isUserLoggedIn = (options: ICb) => {
	const { callback } = options || {};
	registerCb((response) => {
		const { type } = response;
		if (type === "isUserLoggedIn") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.isUserLoggedIn();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "isUserLoggedIn",
		});
	}
};

export const getUser = (options: ICb) => {
	const { callback } = options || {};
	registerCb((response) => {
		const { type } = response;
		if (type === "getUser") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.getUser();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "getUser",
		});
	}
};

export const setWidgetConfig = (data: Record<string, any>) => {
	if (isAndroidApp) {
		webToNative.setWidgetConfig(JSON.stringify({ data }));
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "setWidgetConfig",
			data,
		});
	}
};

export const getUnreadChatsCount = (options: ICb) => {
	const { callback } = options || {};
	registerCb((response) => {
		const { type } = response;
		if (type === "getUnreadChatsCount") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.getUnreadChatsCount();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "getUnreadChatsCount",
		});
	}
};

export const sendChatMessage = (data: ICb) => {
	const { callback, ...rest } = data || {};
	registerCb((response) => {
		const { type } = response;
		if (type === "sendChatMessage") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.sendChatMessage(JSON.stringify({ data: rest }));
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "sendChatMessage",
			data: rest,
		});
	}
};

export const getRestoreID = (options: ICb): void => {
	const { callback } = options || {};
	registerCb((response) => {
		const { type } = response;
		if (type === "getRestoreID") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.getRestoreID();
	} else if (isIosApp && webToNativeIos) {
		const message = {
			action: "getRestoreID",
		};
		webToNativeIos.postMessage(message);
	}
};
