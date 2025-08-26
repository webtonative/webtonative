import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import { 
	BluetoothScanOptions, 
	BluetoothPairOptions, 
	BluetoothUnpairOptions, 
	BluetoothResponse,
	BluetoothPairParams,
	BluetoothUnpairParams
} from "./types";

/**
 * Starts scanning for Bluetooth devices (Android only)
 * @param options - Options for Bluetooth scanning
 */
export const startBluetoothScan = (options: BluetoothScanOptions = {}): void => {
	const { callback } = options;
	if (["ANDROID_APP"].includes(platform)) {
		registerCb((response: BluetoothResponse) => {
			const { type } = response;
			if (type === "startBluetoothScan") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
        	webToNative.startBluetoothScan();
	}
};

/**
 * Pairs with a Bluetooth device (Android only)
 * @param options - Options for pairing with a Bluetooth device
 */
export const pairDevice = (options: BluetoothPairOptions = {}): void => {
	const { callback, address, timeout = 10 } = options;
	if (["ANDROID_APP"].includes(platform)) {
		registerCb((response: BluetoothResponse) => {
			const { type } = response;
			if (type === "pairWithDevice") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
        	webToNative.pairWithDevice(JSON.stringify({
				address,
				timeout
		} as BluetoothPairParams));
	}
};

/**
 * Unpairs from a Bluetooth device (Android only)
 * @param options - Options for unpairing from a Bluetooth device
 */
export const unpairDevice = (options: BluetoothUnpairOptions = {}): void => {
	const { callback, address } = options;
	if (["ANDROID_APP"].includes(platform)) {
		registerCb((response: BluetoothResponse) => {
			const { type } = response;
			if (type === "unpairDevice") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
        	webToNative.unpairDevice(JSON.stringify({
				address
			} as BluetoothUnpairParams));
	}
};