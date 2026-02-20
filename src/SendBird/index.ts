import { isIosApp, isAndroidApp } from "../index";
import { registerCb, webToNative, webToNativeIos } from "../utills";
import { BaseResponse } from "../types";

type IInitializeSendBird = {
	userId: string;
	callback?: (response: BaseResponse) => void;
};
export const initializeSendBird = (options: IInitializeSendBird) => {
	const { userId, callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "initializeSendBird") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.initializeSendBird(JSON.stringify(options));
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "initializeSendBird",
			userId,
		});
	}
};
