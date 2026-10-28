import { Platform, WebToNativeInterface, WebToNativeIosInterface, CallbackFunction, RegisterCallbackOptions } from './types';

const isClient: boolean = typeof window !== "undefined";
const webToNative: WebToNativeInterface = (isClient && (window as any).WebToNativeInterface) || {};
const webToNativeIos: WebToNativeIosInterface | false =
	(isClient &&
		(window as any).webkit &&
		(window as any).webkit.messageHandlers &&
		(window as any).webkit.messageHandlers.webToNativeInterface) ||
	false;
const platform: Platform = webToNative.getAndroidVersion
	? "ANDROID_APP"
	: webToNativeIos
	? "IOS_APP"
	: "WEBSITE";
const isNativeApp: boolean = isClient && platform !== "WEBSITE";
const cbObj: Record<string | number, { cb: CallbackFunction; ignoreDelete?: boolean }> = {};
let counter: number = 1;
let abMobCb: CallbackFunction | null = null;
const handleNativeCallback = (results: string) => {
	let response: any = results;
	let parsed = true;
	if (typeof results == "string") {
		try {
			response = JSON.parse(results);
		} catch (e) {
			parsed = false;
			console.log(e);
		}
	}
	// `routed` means the response identified this callback by key, so the call it
	// belongs to is finished and the callback can be dropped. An unrouted broadcast
	// must never drop anything: the callback is still waiting on its own response,
	// and deleting it here would leave that response with nowhere to go.
	const fireCb = (key: string | number, routed: boolean) => {
		const entry = cbObj[key];
		if (!entry) {
			return;
		}
		if (routed && !entry.ignoreDelete) {
			delete cbObj[key];
		}
		entry.cb(response);
	};
	if (response && response.reqType) {
		fireCb(response.reqType, true);
	} else if (parsed && response && typeof response.type === "string" && cbObj[response.type]) {
		fireCb(response.type, true);
	} else if (parsed && response) {
		for (const key of Object.keys(cbObj)) {
			fireCb(key, false);
		}
	}
};
if (isNativeApp) {
	webToNative.androidCBHook = handleNativeCallback;
	(window as any).iosCBHook = handleNativeCallback;
	(window as any).iOSAdMobCBHook = webToNative.androidAdMobCBHook = (results: string) => {
		let responseObj: any;
		try {
			responseObj = JSON.parse(results);
		} catch (e) {
			console.log(e);
			return;
		}
		abMobCb && abMobCb(responseObj);
	};
}

const registerCb = (cb: CallbackFunction, obj: RegisterCallbackOptions) => {
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