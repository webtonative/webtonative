import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import {
	ICloudSyncResponse,
	IDeleteAppDataOptions,
	IDisableCloudSyncOptions,
	IEnableCloudSyncOptions,
	IGetAppDataOptions,
	ISetAppDataOptions,
} from "./type";

export const setAppData = (options: ISetAppDataOptions = {}) => {
	const { callback, keyName, value } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "setAppData") {
				callback && callback(response);
			}
		}, { key: "setAppData" });

		platform === "ANDROID_APP" &&
			webToNative.setAppData(
				JSON.stringify({
					keyName,
					value,
				})
			);

		platform === "IOS_APP" &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "setAppData",
				keyName,
				value,
			});
	}
};

export const getAppData = (options: IGetAppDataOptions = {}) => {
	const { callback, keyName } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "getAppData") {
				callback && callback(response);
			}
		}, { key: "getAppData" });

		platform === "ANDROID_APP" && webToNative.getAppData(keyName);

		platform === "IOS_APP" &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "getAppData",
				keyName,
			});
	}
};

export const deleteAppData = (options: IDeleteAppDataOptions = {}) => {
	const { callback, keyName } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "deleteAppData") {
				callback && callback(response);
			}
		}, { key: "deleteAppData" });

		platform === "ANDROID_APP" && webToNative.deleteAppData(keyName);

		platform === "IOS_APP" &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "deleteAppData",
				keyName,
			});
	}
};

export const setCloudData = (options: ISetAppDataOptions = {}) => {
	const { callback, keyName, value } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "setCloudData") {
				callback && callback(response);
			}
		}, { key: "setCloudData" });

		platform === "ANDROID_APP" &&
			webToNative.setCloudData(
				JSON.stringify({
					keyName,
					value,
				})
			);

		platform === "IOS_APP" &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "setCloudData",
				keyName,
				value,
			});
	}
};

export const getCloudData = (options: IGetAppDataOptions = {}) => {
	const { callback, keyName } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "getCloudData") {
				callback && callback(response);
			}
		}, { key: "getCloudData" });

		platform === "ANDROID_APP" && webToNative.getCloudData(keyName);

		platform === "IOS_APP" &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "getCloudData",
				keyName,
			});
	}
};

export const deleteCloudData = (options: IDeleteAppDataOptions = {}) => {
	const { callback, keyName } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "deleteCloudData") {
				callback && callback(response);
			}
		}, { key: "deleteCloudData" });

		platform === "ANDROID_APP" && webToNative.deleteCloudData(keyName);

		platform === "IOS_APP" &&
			webToNativeIos &&
			webToNativeIos.postMessage({
				action: "deleteCloudData",
				keyName,
			});
	}
};

/**
 * Registers a one-shot listener for `action`, calls the Android bridge and resolves with the response.
 * Android only — rejects on iOS and on websites.
 * `arg` is passed as-is; omit it for methods that must be called with no argument.
 */
const callCloudSync = (action: string, arg?: string): Promise<ICloudSyncResponse> => {
	return new Promise((resolve, reject) => {
		if (platform !== "ANDROID_APP") {
			reject(
				platform === "IOS_APP"
					? `${action} is only available on Android`
					: "This function will work in Native App Powered By WebToNative"
			);
			return;
		}

		registerCb(
			(response: ICloudSyncResponse) => {
				if (response.type === action) {
					resolve(response);
				}
			},
			{ key: action }
		);

		if (!webToNative[action]) {
			reject(`${action} is not supported in this app version`);
			return;
		}
		arg !== undefined ? webToNative[action](arg) : webToNative[action]();
	});
};

/**
 * Turns on cloud sync (Android only). Pass `selectAccount: true` to explicitly switch the Google account.
 * @example
 * wtn.NativeDatastore.enableCloudSync().then((res) => console.log(res));
 * wtn.NativeDatastore.enableCloudSync({ selectAccount: true }).then((res) => console.log(res));
 */
export const enableCloudSync = (options: IEnableCloudSyncOptions = {}): Promise<ICloudSyncResponse> => {
	return callCloudSync(
		"enableCloudSync",
		options.selectAccount ? JSON.stringify({ selectAccount: true }) : undefined
	);
};

/**
 * Turns off cloud sync (Android only). `deleteRemote: true` also deletes the synced cloud data.
 * @example
 * wtn.NativeDatastore.disableCloudSync({ deleteRemote: false }).then((res) => console.log(res));
 */
export const disableCloudSync = (options: IDisableCloudSyncOptions = {}): Promise<ICloudSyncResponse> => {
	const { deleteRemote = false } = options;
	return callCloudSync("disableCloudSync", JSON.stringify({ deleteRemote }));
};

/**
 * Returns the current cloud sync status (Android only).
 * @example
 * wtn.NativeDatastore.getCloudSyncStatus().then((res) => console.log(res));
 */
export const getCloudSyncStatus = (): Promise<ICloudSyncResponse> => {
	return callCloudSync("getCloudSyncStatus");
};
