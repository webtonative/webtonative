export interface AppsFlyerEventValues {
	[key: string]: any;
}

export interface AppsFlyerIosMessage {
	action: string;
	userId?: string;
	eventName?: string;
	eventValues?: AppsFlyerEventValues;
}