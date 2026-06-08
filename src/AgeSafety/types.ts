export interface AgeSafetyResponse {
	type: string;
	[key: string]: any;
}

export interface AgeSafetyCallback {
	(response: AgeSafetyResponse): void;
}

export interface GetAgeSignalsOptions {
	ageGates: number;
	callback?: AgeSafetyCallback;
}

export interface NotifySignificantChangeOptions {
	topicString?: string;
	callback?: AgeSafetyCallback;
}

export interface AgeSafetyIosMessage {
	action: string;
	ageGates?: number;
	topicString?: string;
}

export interface AgeSafetyAndroidParams {
	action: string;
	ageGates?: number;
}
