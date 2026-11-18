export type BackgroundSyncCallback = (response: BackgroundSyncResponse) => void;

export interface BackgroundSyncResponse {
	type: string;
	[key: string]: any;
}

/** Any params are passed through to native as-is; `callback` is optional alongside the promise. */
export interface BackgroundSyncOptions {
	callback?: BackgroundSyncCallback;
	[key: string]: any;
}
