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

export const addTrigger = (key, value) => {
	if (platform === "ANDROID_APP") {
	} else if (platform === "IOS_APP") {
		webToNativeIos.postMessage({
			action: "addTrigger",
			key,
			value,
		});
	}
};

export const addTriggers = (triggers) => {
	if (platform === "ANDROID_APP") {
	} else if (platform === "IOS_APP") {
		webToNativeIos.postMessage({
			action: "addTriggers",
			triggers,
		});
	}
};

export const removeTrigger = (key) => {
	if (platform === "ANDROID_APP") {
	} else if (platform === "IOS_APP") {
		webToNativeIos.postMessage({
			action: "removeTrigger",
			key,
		});
	}
};

export const removeTriggers = (keys) => {
	if (platform === "ANDROID_APP") {
	} else if (platform === "IOS_APP") {
		webToNativeIos.postMessage({
			action: "removeTriggers",
			keys,
		});
	}
};

export const getTriggerValue = (key, callback) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "getTriggerValue") {
				callback && callback(response);
			}
		});

		if (platform === "ANDROID_APP") {
		} else if (platform === "IOS_APP") {
			webToNativeIos.postMessage({
				action: "getTriggerValue",
				key,
			});
		}
	}
};

export const getTriggers = (callback) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "getTriggers") {
				callback && callback(response);
			}
		});

		if (platform === "ANDROID_APP") {
		} else if (platform === "IOS_APP") {
			webToNativeIos.postMessage({
				action: "getTriggers",
			});
		}
	}
};
