import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import { 
	BluetoothScanOptions, 
	BluetoothPairOptions, 
	BluetoothUnpairOptions, 
	BluetoothResponse,
	BluetoothPairParams,
	BluetoothUnpairParams,
	BluetoothWriteParams
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
		}, { key: "startBluetoothScan" });

		platform === "ANDROID_APP" &&
        	webToNative.startBluetoothScan();
	}
};

/**
 * Pairs with a Bluetooth device (Android only)
 * @param options - Options for pairing with a Bluetooth device
 */
export const pairDevice = (options: BluetoothPairOptions = {}): void => {
	const { callback, timeout = 10,...rest } = options;
	if (["ANDROID_APP"].includes(platform)) {
		registerCb((response: BluetoothResponse) => {
			const { type } = response;
			if (type === "pairWithDevice") {
				callback && callback(response);
			}
		}, { key: "pairWithDevice" });

		platform === "ANDROID_APP" &&
        	webToNative.pairWithDevice(JSON.stringify({

				timeout,
				...rest
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
		}, { key: "unpairDevice" });

		platform === "ANDROID_APP" &&
        	webToNative.unpairDevice(JSON.stringify({
				address
			} as BluetoothUnpairParams));
	}
};

/**
 * Writes a value to a characteristic of a connected Bluetooth device (Android only).
 * Resolves with the native response.
 * @example
 * wtn.Bluetooth.write({
 *   address: "AA:BB:CC:DD:EE:FF",
 *   serviceUuid: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
 *   characteristicUuid: "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
 *   value: "hello",
 *   encoding: "utf8",
 *   withResponse: true,
 * }).then((res) => console.log(res));
 */
export const write = (options: BluetoothWriteParams): Promise<BluetoothResponse> => {
	return new Promise((resolve, reject) => {
		if (platform !== "ANDROID_APP") {
			reject(
				platform === "IOS_APP"
					? "bluetoothWrite is only available on Android"
					: "This function will work in Native App Powered By WebToNative"
			);
			return;
		}

		registerCb((response: BluetoothResponse) => {
			if (response.type === "bluetoothWrite") {
				resolve(response);
			}
		}, { key: "bluetoothWrite" });

		if (!webToNative.bluetoothWrite) {
			reject("bluetoothWrite is not supported in this app version");
			return;
		}
		webToNative.bluetoothWrite(JSON.stringify(options));
	});
};
