/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

export type BackgroundSyncState =
	| "queued"
	| "waiting_for_network"
	| "preparing"
	| "sending"
	| "retrying"
	| "needs_auth"
	| "blocked"
	| "completed"
	| "failed"
	| "cancelled";

export type BackgroundSyncErrorCode =
	| "HTTP_ERROR"
	| "NETWORK_ERROR"
	| "TIMEOUT"
	| "EXPIRED"
	| "FILE_NOT_FOUND"
	| "FILE_TOO_LARGE"
	| "STORAGE_FULL"
	| "PERMISSION_DENIED"
	| "DOMAIN_NOT_ALLOWED"
	| "REF_NOT_FOUND"
	| "CANCELLED_BY_OS"
	| "INTERRUPTED_BY_USER";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** Raw response from the native layer. Every response carries the `type` of the call it answers. */
export interface BackgroundSyncResponse {
	type: string;
	/** Set when the call failed on the native side. */
	error?: BackgroundSyncError;
	[key: string]: any;
}

export type BackgroundSyncCallback<T = BackgroundSyncResponse> = (response: T) => void;

export interface WithCallback<T = BackgroundSyncResponse> {
	/** Called with the same value the promise resolves with. */
	callback?: BackgroundSyncCallback<T>;
}

export interface BackgroundSyncError {
	code: BackgroundSyncErrorCode | string;
	message: string;
	statusCode?: number;
}

/* ------------------------------------------------------------------ */
/* Picking files                                                       */
/* ------------------------------------------------------------------ */

export interface PickFilesOptions extends WithCallback<PickFilesResponse> {
	source?: "gallery" | "camera" | "documents" | "any";
	/** MIME types, wildcards allowed: `["image/*", "video/*", "application/pdf"]`. */
	types?: string[];
	multiple?: boolean;
	maxFiles?: number;
	maxSizeMB?: number;
	compress?: { imageQuality?: number; maxImageDimension?: number };
	convert?: { image?: "jpeg"; video?: "h264" };
	/** Removes EXIF GPS data before upload. */
	stripLocation?: boolean;
}

export interface PickedFile {
	/** Handle used in `enqueue` / `enqueueBatch`. File bytes never cross the bridge. */
	fileId: string;
	name: string;
	/** Size in bytes. */
	size: number;
	mimeType: string;
	width?: number;
	height?: number;
	/** Duration in seconds, for video and audio. */
	duration?: number;
	/** Local URL usable in `<img>` / `<video>` for a preview. */
	previewUrl: string;
}

export interface PickFilesResponse extends BackgroundSyncResponse {
	files: PickedFile[];
}

export interface ReleaseFilesOptions extends WithCallback {
	fileIds: string[];
}

/* ------------------------------------------------------------------ */
/* Queueing                                                            */
/* ------------------------------------------------------------------ */

export type RequestBody =
	| { type: "json"; data: any }
	| { type: "form"; fields: Record<string, string | number | boolean> }
	| {
			type: "multipart";
			fields?: Record<string, string | number | boolean>;
			files: { fieldName: string; fileId: string }[];
	  }
	/** Raw file body, e.g. an S3 presigned PUT. */
	| { type: "binary"; fileId: string };

export interface NotificationOptions {
	title?: string;
	completedTitle?: string;
	failedTitle?: string;
	showProgress?: boolean;
	/** Opened on tap. Supports `{{ then.body.path }}` references. */
	openUrl?: string;
}

/** A request the native layer sends by itself once the item or batch completes. One level deep. */
export interface FollowUpRequest {
	/** Supports `{{ref.body.path}}` and `{{ref.headers.name}}` references. */
	url: string;
	method?: HttpMethod;
	headers?: Record<string, string>;
	body?: RequestBody;
	idempotencyKey?: string;
	includeCookies?: boolean;
	retry?: { maxAttempts?: number };
	metadata?: Record<string, any>;
}

/** Options shared by `enqueue` and `enqueueBatch`. */
export interface SharedRequestOptions {
	/** Named queue: items run strictly FIFO. Omit to run in parallel (max 3 at a time). */
	queue?: string;
	/** Named queues only. Default `"stop"`: a permanent failure blocks the items behind it. */
	onFail?: "stop" | "continue";
	/** Sent as the `Idempotency-Key` header on every attempt. Auto-generated if absent. */
	idempotencyKey?: string;
	/** Copies WebView cookies and User-Agent into the request. */
	includeCookies?: boolean;
	/** Seconds before the item fails with `EXPIRED`. Default 7 days. */
	ttl?: number;
	retry?: { maxAttempts?: number };
	constraints?: { wifiOnly?: boolean };
	/** What to do after a swipe-away / Force Stop. Default `"retry"`. */
	onInterrupted?: "retry" | "fail";
	/** Echoed back in every status and event. */
	metadata?: Record<string, any>;
	/** Default off for json/form, on for files. */
	notification?: NotificationOptions | false;
	then?: FollowUpRequest;
}

export interface EnqueueOptions extends SharedRequestOptions, WithCallback<EnqueueResponse> {
	url: string;
	method?: HttpMethod;
	headers?: Record<string, string>;
	body?: RequestBody;
}

export interface EnqueueResponse extends BackgroundSyncResponse {
	id: string;
}

export interface BatchFile {
	fileId: string;
	/** Per-file URL, since each usually needs its own presigned URL. */
	url: string;
	method?: HttpMethod;
	headers?: Record<string, string>;
	/** When set, the file is sent as multipart with these extra fields. */
	fields?: Record<string, string | number | boolean>;
	/** Name used in follow-up references, e.g. `{{p1.body.id}}`. */
	ref?: string;
}

export interface EnqueueBatchOptions extends SharedRequestOptions, WithCallback<EnqueueBatchResponse> {
	files: BatchFile[];
	/** Default `"abort"`: the follow-up isn't sent if any file fails. */
	onPartialFailure?: "abort" | "skipFailed";
}

export interface EnqueueBatchResponse extends BackgroundSyncResponse {
	batchId: string;
	ids: string[];
}

/* ------------------------------------------------------------------ */
/* Status and recovery                                                 */
/* ------------------------------------------------------------------ */

export interface ItemStatus {
	id: string;
	batchId?: string;
	queue?: string;
	state: BackgroundSyncState;
	bytesSent: number;
	totalBytes: number;
	/** 0–1. */
	progress: number;
	attempts: number;
	error?: BackgroundSyncError;
	/** Body is capped at 64 KB. */
	response?: { statusCode: number; headers: Record<string, string>; body: any };
	metadata?: Record<string, any>;
}

export interface GetStatusOptions extends WithCallback<GetStatusResponse> {
	id: string;
}

export interface GetStatusResponse extends BackgroundSyncResponse, Partial<ItemStatus> {}

export interface ListOptions extends WithCallback<ListResponse> {
	state?: BackgroundSyncState;
	queue?: string;
	batchId?: string;
}

export interface ListResponse extends BackgroundSyncResponse {
	items: ItemStatus[];
}

export interface MarkHandledOptions extends WithCallback {
	ids: string[];
}

/* ------------------------------------------------------------------ */
/* Control                                                             */
/* ------------------------------------------------------------------ */

export type CancelOptions = WithCallback & ({ id: string } | { batchId: string } | { queue: string });

export interface RetryOptions extends WithCallback {
	id: string;
	/** New URL, e.g. a fresh presigned URL. */
	url?: string;
	/** New headers, e.g. a refreshed auth token. */
	headers?: Record<string, string>;
}

export interface IsSupportedResponse extends BackgroundSyncResponse {
	supported: boolean;
	longRunningUploads: boolean;
	notificationPermission: "granted" | "denied" | "prompt";
}

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

export interface BackgroundSyncEventPayloads {
	"backgroundSync:stateChanged": { id: string; state: BackgroundSyncState };
	"backgroundSync:progress": { id: string; bytesSent: number; totalBytes: number; progress: number };
	"backgroundSync:completed": ItemStatus;
	"backgroundSync:failed": ItemStatus;
	"backgroundSync:needsAuth": { id: string; statusCode: number };
	"backgroundSync:cancelled": { id: string };
	"backgroundSync:batchCompleted": {
		batchId: string;
		succeeded: string[];
		failed: string[];
		followUp?: { id: string; state: BackgroundSyncState; response?: ItemStatus["response"] };
	};
}

export type BackgroundSyncEventName = keyof BackgroundSyncEventPayloads;

/** Shape the shared event emitter delivers to handlers. */
export interface BackgroundSyncEvent<E extends BackgroundSyncEventName> {
	type: E;
	data: BackgroundSyncEventPayloads[E];
}
