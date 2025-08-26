import { Platform, WebToNativeInterface, WebToNativeIosInterface, CallbackFunction, RegisterCallbackOptions } from './types';

const isClient: boolean = typeof window !== "undefined";
const webToNative: WebToNativeInterface = (isClient && (window as any).WebToNativeInterface) || {};
const webToNativeIos: WebToNativeIosInterface | false =
	isClient &&
	(window as any).webkit &&
	(window as any).webkit.messageHandlers &&
	(window as any).webkit.messageHandlers.webToNativeInterface;
const platform: Platform = webToNative.getAndroidVersion
	? "ANDROID_APP"
	: webToNativeIos
	? "IOS_APP"
	: "WEBSITE";
const isNativeApp: boolean = isClient && platform !== "WEBSITE";
const cbObj: Record<string | number, { cb: CallbackFunction; ignoreDelete?: boolean }> = {};
let counter: number = 1;
let abMobCb: CallbackFunction | null = null;
if (isNativeApp) {
	webToNative.androidCBHook = (results: string) => {
		var response: any = results;
		try {
			response = JSON.parse(results);
		} catch (e) {
			console.log(e);
		}
		const { type } = response;
		for (var key in cbObj) {
			const { cb, ignoreDelete = false } = cbObj[key];
			if (response && response.reqType) {
				if (key == response["reqType"]) {
					cb(response);
					if (!ignoreDelete) {
						delete cbObj[key];
					}
				}
			} else {
				cb(response);
				if (!ignoreDelete) {
					delete cbObj[key];
				}
			}
		}
	};
	(window as any).iOSAdMobCBHook = webToNative.androidAdMobCBHook = (results: string) => {
		const responseObj = JSON.parse(results);
		abMobCb && abMobCb(responseObj);
	};
	(window as any).iosCBHook = (results: string) => {
		var response: any = results;
		try {
			response = JSON.parse(results);
		} catch (e) {
			console.log(e);
		}
		for (var key in cbObj) {
			const { cb, ignoreDelete = false } = cbObj[key];
			if (response && response.reqType) {
				if (key == response["reqType"]) {
					cb(response);
					if (!ignoreDelete) {
						delete cbObj[key];
					}
				}
			} else {
				cb(response);
				if (!ignoreDelete) {
					delete cbObj[key];
				}
			}
		}
	};
}

const registerCb = (cb: CallbackFunction, obj?: RegisterCallbackOptions) => {
	if (typeof cb === "function") {
		if (obj && obj.key) {
			cbObj[obj["key"]] = { cb, ignoreDelete: obj.ignoreDelete ? true : false };
		} else {
			cbObj[counter] = { cb, ignoreDelete: obj && obj.ignoreDelete ? true : false };
			counter += 1;
		}
	}
};
const registerForAbMobCb = (cb: CallbackFunction) => {
	if (typeof cb === "function") {
		abMobCb = cb;
	}
};
const deRegisterForAbMobCb = () => {
	if (abMobCb) {
		abMobCb = null;
	}
};

const deRegisterCbByKey = (key: string | number) => {
	delete cbObj[key];
};

export {
	webToNative,
	isClient,
	webToNativeIos,
	platform,
	isNativeApp,
	registerCb,
	registerForAbMobCb,
	deRegisterForAbMobCb,
	deRegisterCbByKey,
};