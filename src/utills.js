const isClient = typeof window !== "undefined";
const webToNative = (isClient && window.WebToNativeInterface) || {};
const webToNativeIos =
	isClient &&
	window.webkit &&
	window.webkit.messageHandlers &&
	window.webkit.messageHandlers.webToNativeInterface;
const platform = webToNative.getAndroidVersion
	? "ANDROID_APP"
	: webToNativeIos
	? "IOS_APP"
	: "WEBSITE";
const isNativeApp = isClient && platform !== "WEBSITE";
const cbObj = {};
let counter = 1;
let abMobCb = null;
if (isNativeApp) {
	webToNative.androidCBHook = (results) => {
		var response = results;
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
	window.iOSAdMobCBHook = webToNative.androidAdMobCBHook = (results) => {
		const responseObj = JSON.parse(results);
		abMobCb && abMobCb(responseObj);
	};
	window.iosCBHook = (results) => {
		var response = results;
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

const registerCb = (cb, obj) => {
	if (typeof cb === "function") {
		if (obj && obj.key) {
			cbObj[obj["key"]] = { cb, ignoreDelete: obj.ignoreDelete ? true : false };
		} else {
			cbObj[counter] = { cb, ignoreDelete: obj && obj.ignoreDelete ? true : false };
			counter += 1;
		}
	}
};
const registerForAbMobCb = (cb) => {
	if (typeof cb === "function") {
		abMobCb = cb;
	}
};
const deRegisterForAbMobCb = () => {
	if (abMobCb) {
		abMobCb = null;
	}
};

const deRegisterCbByKey = (key) => {
	delete cbObj[key];
};

export {
	webToNative,
	isClient,
	isNativeApp,
	platform,
	registerCb,
	webToNativeIos,
	registerForAbMobCb,
	deRegisterForAbMobCb,
	deRegisterCbByKey,
};
