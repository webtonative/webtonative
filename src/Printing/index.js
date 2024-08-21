import { platform, webToNative } from "../utills";
/**
 *
 *
 */
export const setPrintSize = (options) => {
	if (["ANDROID_APP"].includes(platform)) {
		let { printSize="ISO_A4", label="" } = options;
		platform === "ANDROID_APP" && 
		webToNative.setPrintSize(JSON.stringify({
			printSize,
			label
		}))
	}
};