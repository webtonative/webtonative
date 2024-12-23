import { isNativeApp, platform, webToNative, registerCb, webToNativeIos } from "../utills";
export const getPlayerId = () => {
	return new Promise((resolve, reject) => {
		registerCb(
			(results) => {
				if (results.isSuccess) {
					resolve(results.playerId);
				} else {
					reject(results);
				}
			},
			{
				key: "getPlayerId",
			}
		);
		if (platform === "ANDROID_APP") {
			webToNative.getOneSignalId();
		} else if (platform === "IOS_APP") {
			webToNativeIos.postMessage({
				action: "getPlayerId",
			});
		} else {
			reject("This function will work in Native App Powered By WebToNative");
		}
	});
};
export const setExternalUserId = (userId) => {
	if (userId) {
		if (platform === "ANDROID_APP") {
			return isNativeApp && webToNative.setExternalUserId(userId);
		} else if (platform === "IOS_APP") {
			webToNativeIos.postMessage({
				action: "setExternalUserId",
				userId: userId,
			});
		}
	} else {
		throw "userId is required";
	}
};
export const removeExternalUserId = () => {
	if (platform === "ANDROID_APP") {
		return isNativeApp && webToNative.removeExternalUserId();
	} else if (platform === "IOS_APP") {
		webToNativeIos.postMessage({
			action: "removeExternalUserId",
		});
	}
};

export const setTags = ({ tags }) => {
	if (tags) {
		if (platform === "ANDROID_APP") {
			return isNativeApp && webToNative.setUserTags(JSON.stringify(tags));
		} else if (platform === "IOS_APP") {
			webToNativeIos.postMessage({
				action: "setUserTags",
				tags,
			});
		}
	}
};

export const addTrigger = (options = {}) => {
	const { key, value } = options;
	if (platform === "ANDROID_APP") {
		webToNative.addTrigger(JSON.stringify({
			key,
			value
		}));
	} else if (platform === "IOS_APP") {
		webToNativeIos.postMessage({
			action: "addTrigger",
			key,
			value,
		});
	}
};

export const addTriggers = (options = {}) => {
	const { triggers } = options;
	if (platform === "ANDROID_APP") {
		webToNative.addTriggers(JSON.stringify({
			triggers
		}));
	} else if (platform === "IOS_APP") {
		webToNativeIos.postMessage({
			action: "addTriggers",
			triggers,
		});
	}
};

export const removeTrigger = (options = {}) => {
	const { key } = options;
	if (platform === "ANDROID_APP") {
		webToNative.removeTriggerForKey(key);
	} else if (platform === "IOS_APP") {
		webToNativeIos.postMessage({
			action: "removeTrigger",
			key,
		});
	}
};

export const removeTriggers = (options = {}) => {
	const { keys } = options;
	if (platform === "ANDROID_APP") {
		webToNative.removeTriggersForKeys(JSON.stringify({keys}));
	} else if (platform === "IOS_APP") {
		webToNativeIos.postMessage({
			action: "removeTriggers",
			keys,
		});
	}
};

export const getTriggerValue = (options = {}) => {
	const { key, callback } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "getTriggerValue") {
				callback && callback(response);
			}
		});

		if (platform === "ANDROID_APP") {
			webToNative.getTriggerValueForKey(key);
		} else if (platform === "IOS_APP") {
			webToNativeIos.postMessage({
				action: "getTriggerValue",
				key,
			});
		}
	}
};

export const getTriggers = (options = {}) => {
	const { callback } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "getTriggers") {
				callback && callback(response);
			}
		});

		if (platform === "ANDROID_APP") {
			webToNative.getTriggers();
		} else if (platform === "IOS_APP") {
			webToNativeIos.postMessage({
				action: "getTriggers",
			});
		}
	}
};

export const setEmail = (options = {}) => {
	const { emailId } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {

		if (platform === "ANDROID_APP") {
			webToNative.setEmail(emailId);
		}
	}
};

export const setSMSNumber = (options = {}) => {
	const { smsNumber } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {

		if (platform === "ANDROID_APP") {
			webToNative.setSMSNumber(smsNumber);
		}
	}
};

export const logoutEmail = (options = {}) => {
	const { emailId } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {

		if (platform === "ANDROID_APP") {
			webToNative.logoutEmail(emailId);
		}
	}
};

export const logoutSMSNumber = (options = {}) => {
	const { smsNumber } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {

		if (platform === "ANDROID_APP") {
			webToNative.logoutSMSNumber(smsNumber);
		}
	}
};

export const optInUser = () => {
	if (platform === "ANDROID_APP") {
		webToNative.optInOneSignalPermissionDialog();
	} else if (platform === "IOS_APP") {
		webToNativeIos.postMessage({
			action: "optInOneSignalPermissionDialog"
		});
	}
};

export const optOutUser = (options = {}) => {
	if (platform === "ANDROID_APP") {
		webToNative.optOutOneSignalPermissionDialog();
	} else if (platform === "IOS_APP") {
		webToNativeIos.postMessage({
			action: "optOutOneSignalPermissionDialog"
		});
	}
};