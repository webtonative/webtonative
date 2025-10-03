import { isIosApp, isAndroidApp } from "./../index";
import { webToNative, webToNativeIos } from "../utills";

export const configure = (options) => {
	const { apiKey, userId } = options || {};
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

export const isInitialized = () => {
	if (isAndroidApp) {
		webToNative.isInitialized(JSON.stringify());
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "isInitialized",
		});
	}
};

export const setUserId = (options) => {
	const { userId } = options || {};
	if (isAndroidApp) {
		webToNative.setUserId(JSON.stringify(options));
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "setUserId",
			userId,
		});
	}
};

export const getCustomerInfo = () => {
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
	const { offeringId } = options || {};
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
	const { productId } = options || {};
	if (isAndroidApp) {
		webToNative.makePurchase(JSON.stringify(options));
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "makePurchase",
			productId,
		});
	}
};

export const restorePurchase = () => {
	if (isAndroidApp) {
		webToNative.restorePurchase(JSON.stringify());
	} else if (isIosApp) {
		webToNativeIos.postMessage({
			action: "restorePurchase",
		});
	}
};
