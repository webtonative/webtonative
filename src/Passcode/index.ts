import { webToNative, webToNativeIos } from "../utills";
import { isAndroidApp, isIosApp } from "../index";

interface ISetPasscodeOptions {
	reauthenticate?: boolean;
}

interface IResetPasscodeOptions {
	resetAppData?: boolean;
}

export const setPasscode = (options?: ISetPasscodeOptions) => {
	const { reauthenticate = true } = options || {};

	if (isAndroidApp) {
		webToNative.setPasscode(reauthenticate);
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "setPasscode",
			reauthenticate,
		});
	}
};

export const resetPasscode = (options?: IResetPasscodeOptions) => {
	const { resetAppData = true } = options || {};

	if (isAndroidApp) {
		webToNative.resetPasscode(resetAppData);
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "resetPasscode",
			resetAppData,
		});
	}
};
