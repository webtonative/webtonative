import { platform, webToNative } from "../utills";
import { PrintingOptions, PrintingAndroidParams } from "./types";

/**
 * Sets the print size for Android printing
 * @param options - Options for setting print size
 */
export const setPrintSize = (options: PrintingOptions): void => {
	if (["ANDROID_APP"].includes(platform)) {
		let { printSize = "ISO_A4", label = "" } = options;
		platform === "ANDROID_APP" && 
		webToNative.setPrintSize(JSON.stringify({
			printSize,
			label
		} as PrintingAndroidParams));
	}
};