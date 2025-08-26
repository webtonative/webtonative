export interface InAppUpdateResponse {
	type: string;
	[key: string]: any;
}

export interface InAppUpdateCallback {
	(response: InAppUpdateResponse): void;
}

export interface CheckUpdateOptions {
	callback?: InAppUpdateCallback;
}

export interface UpdateApplicationOptions {
	updateType?: 'immediate' | 'flexible';
	callback?: InAppUpdateCallback;
}