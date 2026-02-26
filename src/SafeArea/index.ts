import { isIosApp, isAndroidApp } from "./../index";
import { registerCb, webToNative, webToNativeIos } from "../utills";
import { CallbackFunction } from "../types";

export const getSafeArea = (options: { callback?: CallbackFunction }) => {
	const { callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "getSafeArea") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.getSafeArea();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "getSafeArea",
		});
	}
};
