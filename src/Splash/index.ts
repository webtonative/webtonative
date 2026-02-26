import { isIosApp, isAndroidApp } from "./../index";
import { webToNative, webToNativeIos } from "../utills";

export const splashScreenJsTrigger = () => {
	if (isAndroidApp) {
		webToNative.splashScreenJsTrigger();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "splashScreenJsTrigger",
		});
	}
};
