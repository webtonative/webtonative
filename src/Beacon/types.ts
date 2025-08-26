export interface BeaconResponse {
	type: string;
	[key: string]: any;
}

export interface BeaconCallback {
	(response: BeaconResponse): void;
}

export interface BeaconData {
	[key: string]: any;
}

export interface BeaconOptions {
	callback?: BeaconCallback;
	beaconData?: BeaconData;
}

export interface BeaconIosMessage {
	action: string;
	data?: BeaconData;
}