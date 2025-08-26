import { isNativeApp, platform, webToNative, registerCb, webToNativeIos } from "../utills";
import { Platform, RegisterCallbackOptions } from "../types";
import { PlayerIdResponse, OneSignalIosMessage } from "./types";

export const getPlayerId = (): Promise<string> => {
	return new Promise<string>((resolve, reject) => {
		registerCb(
			(results: PlayerIdResponse) => {
				if (results.isSuccess) {
					resolve(results.playerId as string);
				} else {
					reject(results);
				}
			},
			{
				key: "getPlayerId",
			} as RegisterCallbackOptions
		);
		if (platform === "ANDROID_APP") {
			webToNative.getOneSignalId();
		} else if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "getPlayerId",
			} as OneSignalIosMessage);
		} else {
			reject("This function will work in Native App Powered By WebToNative");
		}
	});
};

export const setExternalUserId = (userId: string): boolean | void => {
	if (userId) {
		if (platform === "ANDROID_APP") {
			return isNativeApp && webToNative.setExternalUserId(userId);
		} else if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setExternalUserId",
				userId: userId,
			} as OneSignalIosMessage);
		}
	} else {
		throw "userId is required";
	}
};

export const removeExternalUserId = (): boolean | void => {
	if (platform === "ANDROID_APP") {
		return isNativeApp && webToNative.removeExternalUserId();
	} else if (platform === "IOS_APP" && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "removeExternalUserId",
		} as OneSignalIosMessage);
	}
};