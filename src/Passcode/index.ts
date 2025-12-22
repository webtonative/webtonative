import { webToNative, webToNativeIos } from "../utills";
import { isAndroidApp, isIosApp } from "../index";

interface ISetPasscodeOptions {
	reauthanticate?: boolean;
}

interface IResetPasscodeOptions {
	resetAppData?: boolean;
}

export const setPasscode = (options?: ISetPasscodeOptions) => {
	const { reauthanticate = true } = options || {};

	if (isAndroidApp) {
		webToNative.setPasscode(reauthanticate);
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "setPasscode",
			reauthanticate,
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
