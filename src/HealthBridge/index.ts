import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import {
	HealthBridgeCallback,
	HealthBridgeDeleteOptions,
	HealthBridgeIosMessage,
	HealthBridgeOptions,
	HealthBridgeReadOptions,
	HealthBridgeResponse,
	HealthBridgeWriteOptions,
	HealthRecord,
} from "./types";

const NOT_NATIVE_ERROR = "This function will work in Native App Powered By WebToNative";

/**
 * Registers a one-shot listener for `action`, triggers the native call and resolves with the response.
 * `androidData` is JSON-stringified for the Android bridge (omit for no-arg methods);
 * `iosData` is spread into the iOS postMessage payload.
 */
const callHealthBridge = (
	action: string,
	callback?: HealthBridgeCallback,
	androidData?: object,
	iosData: Omit<HealthBridgeIosMessage, "action"> = {}
): Promise<HealthBridgeResponse> => {
	return new Promise((resolve, reject) => {
		if (!["ANDROID_APP", "IOS_APP"].includes(platform)) {
			reject(NOT_NATIVE_ERROR);
			return;
		}

		registerCb(
			(response: HealthBridgeResponse) => {
				if (response.type === action) {
					callback && callback(response);
					resolve(response);
				}
			},
			{ key: action }
		);

		if (platform === "ANDROID_APP") {
			if (!webToNative[action]) {
				reject(`${action} is not supported in this app version`);
				return;
			}
			androidData ? webToNative[action](JSON.stringify(androidData)) : webToNative[action]();
		} else if (webToNativeIos) {
			webToNativeIos.postMessage({ action, ...iosData } as HealthBridgeIosMessage);
		}
	});
};

/**
 * Checks whether the health provider (Health Connect on Android, HealthKit on iOS)
 * is available on the device and usable by the app.
 * @example
 * wtn.HealthBridge.isAvailable().then((res) => console.log(res.isAvailable));
 */
export const isAvailable = (options: HealthBridgeOptions = {}): Promise<HealthBridgeResponse> => {
	const { callback } = options;
	return callHealthBridge("isHealthBridgeAvailable", callback);
};

/**
 * Opens the Health Connect app so the user can install it or manage app permissions.
 * Android only — on iOS the promise rejects.
 */
export const openProvider = (options: HealthBridgeOptions = {}): Promise<HealthBridgeResponse> => {
	if (platform !== "ANDROID_APP") {
		return Promise.reject(
			platform === "IOS_APP" ? "openProvider is only available on Android" : NOT_NATIVE_ERROR
		);
	}

	const { callback } = options;
	return callHealthBridge("openHealthBridgeProvider", callback);
};

/**
 * Opens the Health Connect permission/settings screen for the app.
 * Android only — on iOS the promise rejects.
 */
// export const openProviderSettings = (options: HealthBridgeOptions = {}): Promise<HealthBridgeResponse> => {
// 	if (platform !== "ANDROID_APP") {
// 		return Promise.reject(
// 			platform === "IOS_APP" ? "openProviderSettings is only available on Android" : NOT_NATIVE_ERROR
// 		);
// 	}

// 	const { callback } = options;
// 	return callHealthBridge("openHealthBridgeProviderSettings", callback);
// };

/**
 * Reads health records for one or more data types within a date range.
 * @example
 * wtn.HealthBridge.read({
 *   dataTypes: ["steps", "distance"],
 *   startDate: "2026-08-16T00:00:00Z",
 *   endDate: "2026-08-17T00:00:00Z",
 * }).then((res) => console.log(res.data));
 */
export const read = (options: HealthBridgeReadOptions): Promise<HealthBridgeResponse> => {
	const { dataTypes, startDate, endDate, limit, pageToken, callback } =
		options || ({} as HealthBridgeReadOptions);

	return callHealthBridge(
		"readHealthBridge",
		callback,
		{ dataTypes, startDate, endDate, limit },
		{ dataTypes, startDate, endDate, pageToken }
	);
};

/**
 * Writes one or more health records. The whole batch goes out in a single native call on both
 * platforms and the promise resolves once.
 * @example
 * wtn.HealthBridge.write({
 *   records: [
 *     { dataType: "steps", value: 1000, unit: "count", start: "2026-08-17T08:30:00Z", end: "2026-08-17T09:00:00Z" },
 *   ],
 * }).then((res) => console.log(res.success));
 */
export const write = (options: HealthBridgeWriteOptions): Promise<HealthBridgeResponse> => {
	const { records, callback } = options || ({} as HealthBridgeWriteOptions);
	if (!records || !records.length) {
		return Promise.reject("records must be a non-empty array");
	}

	const normalized = records.map((record: HealthRecord) => {
		const { dataType, value, unit } = record;
		return {
			dataType,
			value,
			unit,
			start: record.start || record.startDate,
			end: record.end || record.endDate,
		};
	});

	return callHealthBridge(
		"writeHealthBridge",
		callback,
		{ records: normalized },
		{ records: normalized }
	);
};

/**
 * Deletes previously written health records by their record ids.
 * Only records written by this app can be deleted.
 * @example
 * wtn.HealthBridge.deleteRecords({
 *   dataType: "steps",
 *   recordIds: ["b9eadc1d-2bce-4990-9c14-4d976bb29aef"],
 * }).then((res) => console.log(res.success));
 */
export const deleteRecords = (options: HealthBridgeDeleteOptions): Promise<HealthBridgeResponse> => {
	const { dataType, recordIds, callback } = options || ({} as HealthBridgeDeleteOptions);

	return callHealthBridge(
		"deleteHealthBridge",
		callback,
		{ dataType, recordIds },
		{ dataType, recordIds }
	);
};

export default { isAvailable, openProvider, read, write, deleteRecords };
// export default { isAvailable, openProvider, openProviderSettings, read, write, deleteRecords };
