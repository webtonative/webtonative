import { platform, registerCb, deRegisterCbByKey, webToNative, webToNativeIos } from "../utills";
import { on as emitterOn, off as emitterOff, once as emitterOnce } from "../EventEmitter";
import {
	BackgroundSyncEvent,
	BackgroundSyncEventName,
	BackgroundSyncResponse,
	CancelOptions,
	EnqueueBatchOptions,
	EnqueueBatchResponse,
	EnqueueOptions,
	EnqueueResponse,
	GetStatusOptions,
	GetStatusResponse,
	IsSupportedResponse,
	ListOptions,
	ListResponse,
	MarkHandledOptions,
	PickFilesOptions,
	PickFilesResponse,
	ReleaseFilesOptions,
	RetryOptions,
	WithCallback,
} from "./types";

const NOT_NATIVE_ERROR = "This function will work in Native App Powered By WebToNative";

let reqCounter = 0;

/**
 * Triggers a native call and resolves with its response.
 *
 * Each call gets a unique `reqType` that native echoes back, so parallel calls to the same action
 * (e.g. several `enqueue`s at once) each resolve with their own response. If native doesn't echo
 * `reqType`, the response is still matched by `type`.
 *
 * Android: `webToNative[action](JSON.stringify({ reqType, ...params }))`.
 * iOS: `postMessage({ action, reqType, ...params })`.
 * The promise rejects when the response carries `error`.
 */
const callBackgroundSync = <T extends BackgroundSyncResponse>(
	action: string,
	options: WithCallback<any> & Record<string, any> = {}
): Promise<T> => {
	return new Promise((resolve, reject) => {
		if (!["ANDROID_APP", "IOS_APP"].includes(platform)) {
			reject(NOT_NATIVE_ERROR);
			return;
		}
		if (platform === "ANDROID_APP" && !webToNative[action]) {
			reject(`${action} is not supported in this app version`);
			return;
		}

		const { callback, ...params } = options || {};
		reqCounter += 1;
		const reqType = `${action}_${reqCounter}`;

		registerCb(
			(response: T) => {
				if (!response) return;
				const matches = response.reqType ? response.reqType === reqType : response.type === action;
				if (!matches) return;

				deRegisterCbByKey(reqType);
				callback && callback(response);
				response.error ? reject(response) : resolve(response);
			},
			{ key: reqType }
		);

		const payload = { reqType, ...params };
		if (platform === "ANDROID_APP") {
			webToNative[action](JSON.stringify(payload));
		} else if (webToNativeIos) {
			webToNativeIos.postMessage({ action, ...payload });
		}
	});
};

/* ------------------------------------------------------------------ */
/* Picking files                                                       */
/* ------------------------------------------------------------------ */

/**
 * Opens the native picker and copies the picked files into app storage. Returns handles and local
 * preview URLs; file bytes never cross the bridge.
 * @example
 * const { files } = await wtn.BackgroundSync.pickFiles({ source: "gallery", types: ["image/*"], multiple: true, maxFiles: 6 });
 * img.src = files[0].previewUrl;
 */
export const pickFiles = (options: PickFilesOptions = {}): Promise<PickFilesResponse> => {
	return callBackgroundSync<PickFilesResponse>("backgroundSyncPickFiles", options);
};

/**
 * Deletes the app-storage copies of picked files. Call when the user abandons the flow.
 * @example
 * wtn.BackgroundSync.releaseFiles({ fileIds: ["f1", "f2"] });
 */
export const releaseFiles = (options: ReleaseFilesOptions): Promise<BackgroundSyncResponse> => {
	if (!options || !Array.isArray(options.fileIds)) return Promise.reject("fileIds is required");
	return callBackgroundSync("backgroundSyncReleaseFiles", options);
};

/* ------------------------------------------------------------------ */
/* Queueing                                                            */
/* ------------------------------------------------------------------ */

/**
 * Persists a request to the native queue and returns its id. The item is written to disk before
 * this resolves, so it survives an immediate kill.
 * @example
 * const { id } = await wtn.BackgroundSync.enqueue({
 *   url: "https://site.com/orders",
 *   method: "POST",
 *   body: { type: "json", data: { sku: "A1", qty: 2 } },
 *   queue: "orders",
 *   idempotencyKey: "ord_123",
 *   includeCookies: true,
 * });
 */
export const enqueue = (options: EnqueueOptions): Promise<EnqueueResponse> => {
	if (!options || !options.url) return Promise.reject("url is required");
	return callBackgroundSync<EnqueueResponse>("backgroundSyncEnqueue", options);
};

/**
 * Queues one upload per file as a batch, with an optional follow-up sent once all finish.
 * @example
 * wtn.BackgroundSync.enqueueBatch({
 *   files: [
 *     { fileId: "f1", url: "https://site.com/upload", ref: "p1" },
 *     { fileId: "f2", url: "https://site.com/upload", ref: "p2" },
 *   ],
 *   then: {
 *     url: "https://site.com/listings",
 *     method: "POST",
 *     body: { type: "json", data: { photos: ["{{p1.body.id}}", "{{p2.body.id}}"] } },
 *   },
 *   notification: { completedTitle: "Your listing is live", openUrl: "https://site.com/listing/{{then.body.id}}" },
 * });
 */
export const enqueueBatch = (options: EnqueueBatchOptions): Promise<EnqueueBatchResponse> => {
	if (!options || !Array.isArray(options.files) || options.files.length === 0) {
		return Promise.reject("files is required");
	}
	return callBackgroundSync<EnqueueBatchResponse>("backgroundSyncEnqueueBatch", options);
};

/* ------------------------------------------------------------------ */
/* Status and recovery                                                 */
/* ------------------------------------------------------------------ */

/**
 * Returns the current status of one item.
 * @example
 * const status = await wtn.BackgroundSync.getStatus({ id });
 */
export const getStatus = (options: GetStatusOptions): Promise<GetStatusResponse> => {
	if (!options || !options.id) return Promise.reject("id is required");
	return callBackgroundSync<GetStatusResponse>("backgroundSyncGetStatus", options);
};

/**
 * Lists items, optionally filtered. Call on every page load: after a cold start this is the only
 * way to learn what finished while the page wasn't running.
 * @example
 * const { items } = await wtn.BackgroundSync.list({ state: "completed" });
 */
export const list = (options: ListOptions = {}): Promise<ListResponse> => {
	return callBackgroundSync<ListResponse>("backgroundSyncList", options);
};

/**
 * Removes processed items from future `list()` results.
 * @example
 * wtn.BackgroundSync.markHandled({ ids: items.map((i) => i.id) });
 */
export const markHandled = (options: MarkHandledOptions): Promise<BackgroundSyncResponse> => {
	if (!options || !Array.isArray(options.ids)) return Promise.reject("ids is required");
	return callBackgroundSync("backgroundSyncMarkHandled", options);
};

/* ------------------------------------------------------------------ */
/* Control                                                             */
/* ------------------------------------------------------------------ */

/**
 * Cancels one item, a batch, or a whole queue. Cancelling the head of a blocked queue releases
 * the items behind it.
 * @example
 * wtn.BackgroundSync.cancel({ batchId });
 */
export const cancel = (options: CancelOptions): Promise<BackgroundSyncResponse> => {
	const o = (options || {}) as Record<string, any>;
	if (!o.id && !o.batchId && !o.queue) return Promise.reject("id, batchId or queue is required");
	return callBackgroundSync("backgroundSyncCancel", options);
};

/**
 * Retries a failed or needs_auth item, optionally with a new URL and headers (expired tokens or
 * presigned URLs).
 * @example
 * wtn.on("backgroundSync:needsAuth", async ({ data }) => {
 *   wtn.BackgroundSync.retry({ id: data.id, headers: { Authorization: `Bearer ${await refresh()}` } });
 * });
 */
export const retry = (options: RetryOptions): Promise<BackgroundSyncResponse> => {
	if (!options || !options.id) return Promise.reject("id is required");
	return callBackgroundSync("backgroundSyncRetry", options);
};

/**
 * Stops and clears every pending item. Call on logout so one account's files never finish
 * uploading under another account's session.
 * @example
 * await wtn.BackgroundSync.cancelAll();
 */
export const cancelAll = (options: WithCallback = {}): Promise<BackgroundSyncResponse> => {
	return callBackgroundSync("backgroundSyncCancelAll", options);
};

/**
 * Reports whether Background Sync is available and how it's configured. Resolves with
 * `supported: false` outside the app or on apps without the add-on, instead of rejecting.
 * @example
 * const { supported, notificationPermission } = await wtn.BackgroundSync.isSupported();
 */
export const isSupported = (options: WithCallback<IsSupportedResponse> = {}): Promise<IsSupportedResponse> => {
	const unsupported: IsSupportedResponse = {
		type: "backgroundSyncIsSupported",
		supported: false,
		longRunningUploads: false,
		notificationPermission: "prompt",
	};
	const unavailable =
		!["ANDROID_APP", "IOS_APP"].includes(platform) ||
		(platform === "ANDROID_APP" && !webToNative.backgroundSyncIsSupported);

	if (unavailable) {
		options.callback && options.callback(unsupported);
		return Promise.resolve(unsupported);
	}
	return callBackgroundSync<IsSupportedResponse>("backgroundSyncIsSupported", options);
};

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

/**
 * Typed wrapper over `wtn.on` for Background Sync events. Native pushes these through
 * `nativeEventCB`; queue-buffered events replay when the WebView loads.
 * @example
 * wtn.BackgroundSync.on("backgroundSync:progress", ({ data }) => setProgress(data.id, data.progress));
 */
export const on = <E extends BackgroundSyncEventName>(
	event: E,
	handler: (event: BackgroundSyncEvent<E>) => void
): void => emitterOn(event, handler);

export const once = <E extends BackgroundSyncEventName>(
	event: E,
	handler: (event: BackgroundSyncEvent<E>) => void
): void => emitterOnce(event, handler);

export const off = <E extends BackgroundSyncEventName>(
	event: E,
	handler?: (event: BackgroundSyncEvent<E>) => void
): void => emitterOff(event, handler);

export default {
	pickFiles,
	releaseFiles,
	enqueue,
	enqueueBatch,
	getStatus,
	list,
	markHandled,
	cancel,
	retry,
	cancelAll,
	isSupported,
	on,
	once,
	off,
};
