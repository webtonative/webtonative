import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import { IDeleteAppDataOptions, IGetAppDataOptions, ISetAppDataOptions } from "./type";

export const setAppData = (options: ISetAppDataOptions = {}) => {
	const { callback, keyName, value } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "setAppData") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
			webToNative.setAppData(
				JSON.stringify({
					keyName,
					value,
				})
			);

		platform === "IOS_APP" &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "setAppData",
				keyName,
				value,
			});
	}
};

export const getAppData = (options: IGetAppDataOptions = {}) => {
	const { callback, keyName } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "getAppData") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.getAppData(keyName);

		platform === "IOS_APP" &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "getAppData",
				keyName,
			});
	}
};

export const deleteAppData = (options: IDeleteAppDataOptions = {}) => {
	const { callback, keyName } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "deleteAppData") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.deleteAppData(keyName);

		platform === "IOS_APP" &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "deleteAppData",
				keyName,
			});
	}
};

export const setCloudData = (options: ISetAppDataOptions = {}) => {
	const { callback, keyName, value } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "setCloudData") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
			webToNative.setCloudData(
				JSON.stringify({
					keyName,
					value,
				})
			);

		platform === "IOS_APP" &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "setCloudData",
				keyName,
				value,
			});
	}
};

export const getCloudData = (options: IGetAppDataOptions = {}) => {
	const { callback, keyName } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "getCloudData") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.getCloudData(keyName);

		platform === "IOS_APP" &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "getCloudData",
				keyName,
			});
	}
};

export const deleteCloudData = (options: IDeleteAppDataOptions = {}) => {
	const { callback, keyName } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "deleteCloudData") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.deleteCloudData(keyName);

		platform === "IOS_APP" &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "deleteCloudData",
				keyName,
			});
	}
};
