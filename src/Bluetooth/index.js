import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
/**
 *
 *
 */
export const startBluetoothScan = (options = {}) => {
	const { callback } = options;
	if (["ANDROID_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "startBluetoothScan") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
        	webToNative.startBluetoothScan();
	}
};


export const pairDevice = (options = {}) => {
	const { callback, address, timeout=10 } = options;
	if (["ANDROID_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "pairWithDevice") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
        	webToNative.pairWithDevice(JSON.stringify({
				address,
				timeout
		}));

	}
};


export const unpairDevice = (options = {}) => {
	const { callback, address } = options;
	if (["ANDROID_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "unpairDevice") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
        	webToNative.unpairDevice(JSON.stringify({
				address
			}));

	}
};