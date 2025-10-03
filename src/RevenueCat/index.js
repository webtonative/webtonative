import { isIosApp, isAndroidApp } from "./../index";
import { registerCb, webToNative, webToNativeIos } from "../utills";

export const configure = (options) => {
	const { apiKey, userId, callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "configure") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.configure(JSON.stringify(options));
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "configure",
			apiKey,
			userId,
		});
	}
};

export const isInitialized = (options) => {
	const { callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "isInitialized") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.isInitialized(JSON.stringify());
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "isInitialized",
		});
	}
};

export const setUserId = (options) => {
	const { userId, callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "setUserId") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.setUserId(JSON.stringify(options));
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "setUserId",
			userId,
		});
	}
};

export const getCustomerInfo = (options) => {
	const { callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "getCustomerInfo") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.getCustomerInfo(JSON.stringify());
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "getCustomerInfo",
			userId,
		});
	}
};

export const showPaywall = (options) => {
	const { offeringId, callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "showPaywall") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.showPaywall(JSON.stringify(options));
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "showPaywall",
			offeringId,
		});
	}
};

export const makePurchase = (options) => {
	const { productId, callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "makePurchase") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.makePurchase(JSON.stringify(options));
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "makePurchase",
			productId,
		});
	}
};

export const restorePurchase = (options) => {
	const { callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "restorePurchase") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.restorePurchase(JSON.stringify());
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "restorePurchase",
		});
	}
};
