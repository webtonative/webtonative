import { deRegisterCbByKey, platform, registerCb, webToNative, webToNativeIos } from "../utills";
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
 * Writes one or more health records.
 *
 * Android accepts the whole batch in a single native call. iOS accepts a single record per
 * call, so on iOS one native message is sent per record and the callback fires once per record.
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

	if (platform === "ANDROID_APP") {
		registerCb(
			(response: HealthBridgeResponse) => {
				const { type } = response;
				if (type === "writeHealthBridge") {
					callback && callback(response);
				}
			},
			{ key: "writeHealthBridge" }
		);

		webToNative.writeHealthBridge &&
			webToNative.writeHealthBridge(JSON.stringify({ records: normalized }));
	} else if (webToNativeIos) {
		// iOS writes a single record per native call, so the callback stays registered
		// until every record in the batch has responded.
		let pending = normalized.length;

		registerCb(
			(response: HealthBridgeResponse) => {
				const { type } = response;
				if (type === "writeHealthBridge") {
					callback && callback(response);
					pending -= 1;
					if (pending <= 0) {
						deRegisterCbByKey("writeHealthBridge");
					}
				}
			},
			{ key: "writeHealthBridge", ignoreDelete: true }
		);

		normalized.forEach(({ dataType, value, unit, start, end }) => {
			webToNativeIos &&
				webToNativeIos.postMessage({
					action: "writeHealthBridge",
					dataType,
					value,
					unit,
					startDate: start,
					endDate: end,
				} as HealthBridgeIosMessage);
		});
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
