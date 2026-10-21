import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import {
  ClipboardResponse,
  GetClipboardOptions,
  SetClipboardOptions,
  ClipboardIosMessage
} from "./types";

/**
 * Gets content from clipboard
 * @param options - Options for getting clipboard content
 */
export const get = (options: GetClipboardOptions = {}): void => {
	const { callback } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response: ClipboardResponse) => {
			const { type } = response;
			if (type === "CLIPBOARD_CONTENT") {
				callback && callback(response);
			}
		});

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "getClipBoardData",
			} as ClipboardIosMessage);
		}

		platform === "ANDROID_APP" && webToNative.getText();
	}
};

/**
 * Sets content to clipboard
 * @param options - Options for setting clipboard content
 */
export const set = (options: SetClipboardOptions = {}): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setClipBoardData",
				text: options.data || "",
			} as ClipboardIosMessage);
		}

		platform === "ANDROID_APP" && webToNative.setText(options.data || "");
	}
};