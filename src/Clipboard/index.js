import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
/**
 *
 *
 */
export const get = (options = {}) => {
	const { callback } = options;
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
			});

		platform === "ANDROID_APP" && webToNative.getText();
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

		platform === "ANDROID_APP" && webToNative.setText(options.data || "");
	}
};
