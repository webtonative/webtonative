import { isNativeApp, platform, webToNative, registerCb, webToNativeIos } from "../utills";
import { Platform, RegisterCallbackOptions } from "../types";
import {
	PlayerIdResponse,
	OneSignalIosMessage,
	TagsOptions,
	TriggerOptions,
	TriggerResponse,
	EmailOptions,
	SMSOptions,
} from "./types";

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

export const setTags = ({ tags }: TagsOptions): boolean | void => {
	if (tags) {
		if (platform === "ANDROID_APP") {
			return isNativeApp && webToNative.setUserTags(JSON.stringify(tags));
		} else if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setUserTags",
				tags,
			} as OneSignalIosMessage);
		}
	}
};

export const addTrigger = (options: TriggerOptions = {}): void => {
	const { key, value } = options;
	if (platform === "ANDROID_APP") {
		webToNative.addTrigger(
			JSON.stringify({
				key,
				value,
			})
		);
	} else if (platform === "IOS_APP" && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "addTrigger",
			key,
			value,
		} as OneSignalIosMessage);
	}
};

export const addTriggers = (options: TriggerOptions = {}): void => {
	const { triggers } = options;
	if (platform === "ANDROID_APP") {
		webToNative.addTriggers(
			JSON.stringify({
				triggers,
			})
		);
	} else if (platform === "IOS_APP" && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "addTriggers",
			triggers,
		} as OneSignalIosMessage);
	}
};

export const removeTrigger = (options: TriggerOptions = {}): void => {
	const { key } = options;
	if (platform === "ANDROID_APP") {
		webToNative.removeTriggerForKey(key);
	} else if (platform === "IOS_APP" && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "removeTrigger",
			key,
		} as OneSignalIosMessage);
	}
};

export const removeTriggers = (options: TriggerOptions = {}): void => {
	const { keys } = options;
	if (platform === "ANDROID_APP") {
		webToNative.removeTriggersForKeys(JSON.stringify({ keys }));
	} else if (platform === "IOS_APP" && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "removeTriggers",
			keys,
		} as OneSignalIosMessage);
	}
};

export const getTriggerValue = (options: TriggerOptions = {}): void => {
	const { key, callback } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response: TriggerResponse) => {
			const { type } = response;
			if (type === "getTriggerValue") {
				callback && callback(response);
			}
		});

		if (platform === "ANDROID_APP") {
			webToNative.getTriggerValueForKey(key);
		} else if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "getTriggerValue",
				key,
			} as OneSignalIosMessage);
		}
	}
};

export const getTriggers = (options: TriggerOptions = {}): void => {
	const { callback } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response: TriggerResponse) => {
			const { type } = response;
			if (type === "getTriggers") {
				callback && callback(response);
			}
		});

		if (platform === "ANDROID_APP") {
			webToNative.getTriggers();
		} else if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "getTriggers",
			} as OneSignalIosMessage);
		}
	}
};

export const setEmail = (options: EmailOptions = {}): void => {
	const { emailId } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		if (platform === "ANDROID_APP") {
			webToNative.setEmail(emailId);
		} else if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setEmail",
				emailId,
			} as OneSignalIosMessage);
		}
	}
};

export const setSMSNumber = (options: SMSOptions = {}): void => {
	const { smsNumber } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		if (platform === "ANDROID_APP") {
			webToNative.setSMSNumber(smsNumber);
		} else if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setSMSNumber",
				smsNumber,
			} as OneSignalIosMessage);
		}
	}
};

export const logoutEmail = (options: EmailOptions = {}): void => {
	const { emailId } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		if (platform === "ANDROID_APP") {
			webToNative.logoutEmail(emailId);
		} else if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "logoutEmail",
				emailId,
			} as OneSignalIosMessage);
		}
	}
};

export const logoutSMSNumber = (options: SMSOptions = {}): void => {
	const { smsNumber } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		if (platform === "ANDROID_APP") {
			webToNative.logoutSMSNumber(smsNumber);
		} else if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "logoutSMSNumber",
				smsNumber,
			} as OneSignalIosMessage);
		}
	}
};

export const optInUser = (): void => {
	if (platform === "ANDROID_APP") {
		webToNative.optInOneSignalPermissionDialog();
	} else if (platform === "IOS_APP" && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "optInOneSignalPermissionDialog",
		} as OneSignalIosMessage);
	}
};

export const optOutUser = (): void => {
	if (platform === "ANDROID_APP") {
		webToNative.optOutOneSignalPermissionDialog();
	} else if (platform === "IOS_APP" && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "optOutOneSignalPermissionDialog",
		} as OneSignalIosMessage);
	}
};
