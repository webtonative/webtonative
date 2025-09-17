import { isIosApp } from "./../index";

export const setPasscode = () => {
	isIosApp &&
		webToNativeIos.postMessage({
			action: "setPasscode",
		});
};
export const resetPasscode = (options) => {
	const { resetAppData = true } = options || {};
	isIosApp &&
		webToNativeIos.postMessage({
			action: "resetPasscode",
			resetAppData,
		});
};
