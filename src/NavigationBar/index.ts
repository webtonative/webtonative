import { platform, webToNative, webToNativeIos } from "../utills";

interface IOptions {
	color?: string;
}
export const setNavigationBarColor = (options: IOptions = {}): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "ANDROID_APP" && webToNative.setNavigationBarColor(JSON.stringify(options));

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setNavigationBarColor",
				options,
			});
		}
	}
};
