import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import { BackgroundSyncOptions, BackgroundSyncResponse } from "./types";

const NOT_NATIVE_ERROR = "This function will work in Native App Powered By WebToNative";

/**
 * Registers a one-shot listener for `action`, triggers the native call and resolves with the response.
 * The `callback` option (if any) is stripped from the payload and called alongside the promise.
 * Android: the payload is sent as a single JSON string — `webToNative[action](params: String?)`.
 * iOS: the payload fields are spread into the postMessage body — `{ action, ...params }`.
 */
const callBackgroundSync = (
	action: string,
	options: BackgroundSyncOptions = {}
): Promise<BackgroundSyncResponse> => {
	return new Promise((resolve, reject) => {
		if (!["ANDROID_APP", "IOS_APP"].includes(platform)) {
			reject(NOT_NATIVE_ERROR);
			return;
		}

		const { callback, ...params } = options || {};

		registerCb(
			(response: BackgroundSyncResponse) => {
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
			webToNative[action](JSON.stringify(params));
		} else if (webToNativeIos) {
			webToNativeIos.postMessage({ action, ...params });
		}
	});
};

/**
 * Calls `backgroundSyncIsSupported` on the native side.
 * @example
 * wtn.BackgroundSync.isSupported({ ... }).then((res) => console.log(res));
 */
export const isSupported = (options: BackgroundSyncOptions = {}): Promise<BackgroundSyncResponse> => {
	return callBackgroundSync("backgroundSyncIsSupported", options);
};

/**
 * Calls `backgroundSyncEnqueue` on the native side.
 * @example
 * wtn.BackgroundSync.enqueue({ ... }).then((res) => console.log(res));
 */
export const enqueue = (options: BackgroundSyncOptions = {}): Promise<BackgroundSyncResponse> => {
	return callBackgroundSync("backgroundSyncEnqueue", options);
};

/**
 * Calls `backgroundSyncEnqueueBatch` on the native side.
 * @example
 * wtn.BackgroundSync.enqueueBatch({ ... }).then((res) => console.log(res));
 */
export const enqueueBatch = (options: BackgroundSyncOptions = {}): Promise<BackgroundSyncResponse> => {
	return callBackgroundSync("backgroundSyncEnqueueBatch", options);
};

/**
 * Calls `backgroundSyncGetStatus` on the native side.
 * @example
 * wtn.BackgroundSync.getStatus({ ... }).then((res) => console.log(res));
 */
export const getStatus = (options: BackgroundSyncOptions = {}): Promise<BackgroundSyncResponse> => {
	return callBackgroundSync("backgroundSyncGetStatus", options);
};

/**
 * Calls `backgroundSyncList` on the native side.
 * @example
 * wtn.BackgroundSync.list({ ... }).then((res) => console.log(res));
 */
export const list = (options: BackgroundSyncOptions = {}): Promise<BackgroundSyncResponse> => {
	return callBackgroundSync("backgroundSyncList", options);
};

/**
 * Calls `backgroundSyncMarkHandled` on the native side.
 * @example
 * wtn.BackgroundSync.markHandled({ ... }).then((res) => console.log(res));
 */
export const markHandled = (options: BackgroundSyncOptions = {}): Promise<BackgroundSyncResponse> => {
	return callBackgroundSync("backgroundSyncMarkHandled", options);
};

/**
 * Calls `backgroundSyncCancel` on the native side.
 * @example
 * wtn.BackgroundSync.cancel({ ... }).then((res) => console.log(res));
 */
export const cancel = (options: BackgroundSyncOptions = {}): Promise<BackgroundSyncResponse> => {
	return callBackgroundSync("backgroundSyncCancel", options);
};

/**
 * Calls `backgroundSyncRetry` on the native side.
 * @example
 * wtn.BackgroundSync.retry({ ... }).then((res) => console.log(res));
 */
export const retry = (options: BackgroundSyncOptions = {}): Promise<BackgroundSyncResponse> => {
	return callBackgroundSync("backgroundSyncRetry", options);
};

/**
 * Calls `backgroundSyncCancelAll` on the native side.
 * @example
 * wtn.BackgroundSync.cancelAll({ ... }).then((res) => console.log(res));
 */
export const cancelAll = (options: BackgroundSyncOptions = {}): Promise<BackgroundSyncResponse> => {
	return callBackgroundSync("backgroundSyncCancelAll", options);
};

/**
 * Calls `backgroundSyncPickFiles` on the native side.
 * @example
 * wtn.BackgroundSync.pickFiles({ ... }).then((res) => console.log(res));
 */
export const pickFiles = (options: BackgroundSyncOptions = {}): Promise<BackgroundSyncResponse> => {
	return callBackgroundSync("backgroundSyncPickFiles", options);
};

/**
 * Calls `backgroundSyncReleaseFiles` on the native side.
 * @example
 * wtn.BackgroundSync.releaseFiles({ ... }).then((res) => console.log(res));
 */
export const releaseFiles = (options: BackgroundSyncOptions = {}): Promise<BackgroundSyncResponse> => {
	return callBackgroundSync("backgroundSyncReleaseFiles", options);
};
