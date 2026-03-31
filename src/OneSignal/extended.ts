import { platform, webToNative, registerCb, webToNativeIos } from "../utills";
import {
	PermissionStatusResponse,
	RequestPermissionResponse,
	SubscriptionStatusResponse,
	OneSignalIosMessage,
} from "./types";

export const getPermissionStatus = (): Promise<PermissionStatusResponse> => {
	return new Promise<PermissionStatusResponse>((resolve, reject) => {
		registerCb(
			(results: PermissionStatusResponse) => {
				resolve(results);
			},
			{ key: "getPermissionStatus" }
		);
		if (platform === "ANDROID_APP") {
			webToNative.getPermissionStatus();
		} else if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "getPermissionStatus",
			} as OneSignalIosMessage);
		} else {
			reject("This function will work in Native App Powered By WebToNative");
		}
	});
};

export const requestPermission = (): Promise<RequestPermissionResponse> => {
	return new Promise<RequestPermissionResponse>((resolve, reject) => {
		registerCb(
			(results: RequestPermissionResponse) => {
				resolve(results);
			},
			{ key: "requestPermission" }
		);
		if (platform === "ANDROID_APP") {
			webToNative.requestPermission();
		} else if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "requestPermission",
			} as OneSignalIosMessage);
		} else {
			reject("This function will work in Native App Powered By WebToNative");
		}
	});
};

export const getSubscriptionStatus = (): Promise<SubscriptionStatusResponse> => {
	return new Promise<SubscriptionStatusResponse>((resolve, reject) => {
		registerCb(
			(results: SubscriptionStatusResponse) => {
				resolve(results);
			},
			{ key: "getSubscriptionStatus" }
		);
		if (platform === "ANDROID_APP") {
			webToNative.getSubscriptionStatus();
		} else if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "getSubscriptionStatus",
			} as OneSignalIosMessage);
		} else {
			reject("This function will work in Native App Powered By WebToNative");
		}
	});
};
