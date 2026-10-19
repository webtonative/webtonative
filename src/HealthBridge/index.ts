import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import {
	HealthBridgeDeleteOptions,
	HealthBridgeIosMessage,
	HealthBridgeOptions,
	HealthBridgeReadOptions,
	HealthBridgeResponse,
	HealthBridgeWriteOptions,
	HealthRecord,
} from "./types";

/**
 * Checks whether the health provider (Health Connect on Android, HealthKit on iOS)
 * is available on the device and usable by the app.
 * @example
 * wtn.HealthBridge.isAvailable({ callback: (res) => console.log(res.isAvailable) });
 */
export const isAvailable = (options: HealthBridgeOptions = {}): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;

	const { callback } = options;

	registerCb(
		(response: HealthBridgeResponse) => {
			const { type } = response;
			if (type === "isHealthBridgeAvailable") {
				callback && callback(response);
			}
		},
		{ key: "isHealthBridgeAvailable" }
	);

	if (platform === "ANDROID_APP") {
		webToNative.isHealthBridgeAvailable && webToNative.isHealthBridgeAvailable();
	} else if (webToNativeIos) {
		webToNativeIos.postMessage({
			action: "isHealthBridgeAvailable",
		} as HealthBridgeIosMessage);
	}
};

/**
 * Opens the Health Connect app so the user can install it or manage app permissions.
 * Android only — on iOS this is a no-op.
 */
export const openProvider = (options: HealthBridgeOptions = {}): void => {
	if (platform !== "ANDROID_APP") return;

	const { callback } = options;

	registerCb(
		(response: HealthBridgeResponse) => {
			const { type } = response;
			if (type === "openHealthBridgeProvider") {
				callback && callback(response);
			}
		},
		{ key: "openHealthBridgeProvider" }
	);

	webToNative.openHealthBridgeProvider && webToNative.openHealthBridgeProvider();
};

/**
 * Opens the Health Connect permission/settings screen for the app.
 * Android only — on iOS this is a no-op.
 */
export const openProviderSettings = (options: HealthBridgeOptions = {}): void => {
	if (platform !== "ANDROID_APP") return;

	const { callback } = options;

	registerCb(
		(response: HealthBridgeResponse) => {
			const { type } = response;
			if (type === "openHealthBridgeProviderSettings") {
				callback && callback(response);
			}
		},
		{ key: "openHealthBridgeProviderSettings" }
	);

	webToNative.openHealthBridgeProviderSettings && webToNative.openHealthBridgeProviderSettings();
};

/**
 * Reads health records for one or more data types within a date range.
 * @example
 * wtn.HealthBridge.read({
 *   dataTypes: ["steps", "distance"],
 *   startDate: "2026-08-16T00:00:00Z",
 *   endDate: "2026-08-17T00:00:00Z",
 *   callback: (res) => console.log(res.data),
 * });
 */
export const read = (options: HealthBridgeReadOptions): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;

	const { dataTypes, startDate, endDate, limit, pageToken, callback } =
		options || ({} as HealthBridgeReadOptions);

	registerCb(
		(response: HealthBridgeResponse) => {
			const { type } = response;
			if (type === "readHealthBridge") {
				callback && callback(response);
			}
		},
		{ key: "readHealthBridge" }
	);

	if (platform === "ANDROID_APP") {
		webToNative.readHealthBridge &&
			webToNative.readHealthBridge(JSON.stringify({ dataTypes, startDate, endDate, limit }));
	} else if (webToNativeIos) {
		webToNativeIos.postMessage({
			action: "readHealthBridge",
			dataTypes,
			startDate,
			endDate,
			pageToken,
		} as HealthBridgeIosMessage);
	}
};

/**
 * Writes one or more health records. The whole batch goes out in a single native call on both
 * platforms and the callback fires once.
 * @example
 * wtn.HealthBridge.write({
 *   records: [
 *     { dataType: "steps", value: 1000, unit: "count", start: "2026-08-17T08:30:00Z", end: "2026-08-17T09:00:00Z" },
 *   ],
 *   callback: (res) => console.log(res.success),
 * });
 */
export const write = (options: HealthBridgeWriteOptions): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;

	const { records, callback } = options || ({} as HealthBridgeWriteOptions);
	if (!records || !records.length) return;

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

	registerCb(
		(response: HealthBridgeResponse) => {
			const { type } = response;
			if (type === "writeHealthBridge") {
				callback && callback(response);
			}
		},
		{ key: "writeHealthBridge" }
	);

	if (platform === "ANDROID_APP") {
		webToNative.writeHealthBridge &&
			webToNative.writeHealthBridge(JSON.stringify({ records: normalized }));
	} else if (webToNativeIos) {
		webToNativeIos.postMessage({
			action: "writeHealthBridge",
			records: normalized,
		} as HealthBridgeIosMessage);
	}
};

/**
 * Deletes previously written health records by their record ids.
 * Only records written by this app can be deleted.
 * @example
 * wtn.HealthBridge.deleteRecords({
 *   dataType: "steps",
 *   recordIds: ["b9eadc1d-2bce-4990-9c14-4d976bb29aef"],
 *   callback: (res) => console.log(res.success),
 * });
 */
export const deleteRecords = (options: HealthBridgeDeleteOptions): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;

	const { dataType, recordIds, callback } = options || ({} as HealthBridgeDeleteOptions);

	registerCb(
		(response: HealthBridgeResponse) => {
			const { type } = response;
			if (type === "deleteHealthBridge") {
				callback && callback(response);
			}
		},
		{ key: "deleteHealthBridge" }
	);

	if (platform === "ANDROID_APP") {
		webToNative.deleteHealthBridge &&
			webToNative.deleteHealthBridge(JSON.stringify({ dataType, recordIds }));
	} else if (webToNativeIos) {
		webToNativeIos.postMessage({
			action: "deleteHealthBridge",
			dataType,
			recordIds,
		} as HealthBridgeIosMessage);
	}
};

export default { isAvailable, openProvider, openProviderSettings, read, write, deleteRecords };
