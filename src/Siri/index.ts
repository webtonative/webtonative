import { platform, webToNativeIos } from "../utills";
import { SiriOptions, SiriIosMessage } from "./types";

/**
 * Adds an action to Siri (iOS only)
 * @param options - Options for adding to Siri
 */
export const addToSiri = (options: SiriOptions = {}): void => {
	const { actionUrl, suggestedPhrase, title } = options;
	if (["IOS_APP"].includes(platform)) {
		
		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				"action": "addToSiri",
				"data": {
					actionUrl,
					suggestedPhrase,
					title
				}
			} as SiriIosMessage);
		}
	}
};