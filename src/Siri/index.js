import { platform, webToNativeIos } from "../utills";
/**
 *
 *
 */
export const addToSiri = (options = {}) => {
	const { actionUrl, suggestedPhrase, title } = options;
	if (["IOS_APP"].includes(platform)) {
		
		platform === "IOS_APP" && webToNativeIos.postMessage({
			"action":"addToSiri",
			"data":{
				actionUrl,
				suggestedPhrase,
				title
			}
		});
	}
};