import { platform, registerCb, webToNativeIos } from "../utills";
/**
 *
 *
 */
export const get = () => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "CLIPBOARD_CONTENT") {
				callback && callback(response);
			}
		});

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "getClipBoardData",
				flag: true,
			});
	}
};

/**
 *
 *
 */
export const set = (options = {}) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "setClipBoardData",
				text: options.data || "",
			});
	}
};
