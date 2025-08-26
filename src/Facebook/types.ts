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

export interface FacebookEventIosMessage {
	action: string;
	eventName?: string;
	valueToSum?: number;
	parameters?: FacebookEventParameters;
	currency?: string;
	amount?: number;
}