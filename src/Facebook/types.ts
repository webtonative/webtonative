export interface FacebookEventParameters {
	[key: string]: any;
}

export interface FacebookEventOptions {
	event: string;
	valueToSum?: number;
	parameters?: FacebookEventParameters;
}

export interface FacebookPurchaseOptions {
	amount: number;
	currency: string;
	parameters?: FacebookEventParameters;
}

export interface FacebookAnalyticsCollectionOptions {
	enabled: boolean;
}

export interface FacebookAnalyticsCollectionStatusResponse {
	type: "getFacebookAnalyticsCollectionStatus";
	enabled: boolean;
	[key: string]: any;
}

export interface FacebookAnalyticsCollectionStatusOptions {
	callback?: (response: FacebookAnalyticsCollectionStatusResponse) => void;
}

export interface FacebookEventIosMessage {
	action: string;
	eventName?: string;
	valueToSum?: number;
	parameters?: FacebookEventParameters;
	currency?: string;
	amount?: number;
}