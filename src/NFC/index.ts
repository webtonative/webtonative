import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import {
	NFCResponse,
	NFCCallback,
	NFCIosMessage,
	NFCScanTagOptions,
	NFCWriteTagOptions,
} from "./types";

export const status = (callback?: NFCCallback): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response: NFCResponse) => {
			const { type } = response;
			if (type === "nfcGetStatus") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.nfcGetStatus();

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "nfcGetStatus",
			} as NFCIosMessage);
		}
	}
};

export const read = (options: NFCScanTagOptions = {}): void => {
	const { message, openUrl = false, continuous = false, callback } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb(
			(response: NFCResponse) => {
				const { type } = response;
				if (type === "nfcScanTag") {
					callback && callback(response);
				}
			},
			{ ignoreDelete: continuous }
		);

		platform === "ANDROID_APP" && webToNative.nfcScanTag(JSON.stringify({ message, openUrl }));

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "nfcScanTag",
				message,
				openUrl,
			} as NFCIosMessage);
		}
	}
};

export const write = (options: NFCWriteTagOptions): void => {
	const { type, content, message, callback } = options || {};
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response: NFCResponse) => {
			const { type: responseType } = response;
			if (responseType === "nfcWriteTag") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" && webToNative.nfcWriteTag(JSON.stringify(options));

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "nfcWriteTag",
				type,
				content,
				message,
			} as NFCIosMessage);
		}
	}
};

export default { status, read, write };
