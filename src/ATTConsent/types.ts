export interface ATTConsentResponse {
	type: string;
	status?: string;
	[key: string]: any;
}

export interface ATTConsentCallback {
	(response: ATTConsentResponse): void;
}

export interface ATTConsentOptions {
	callback?: ATTConsentCallback;
}

export interface ATTConsentIosMessage {
	action: string;
}