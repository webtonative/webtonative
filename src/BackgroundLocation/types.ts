export interface LocationUpdateResponse {
	type: string;
	latitude?: number;
	longitude?: number;
	[key: string]: any;
}

export interface LocationCallback {
	(response: LocationUpdateResponse): void;
}

export interface BackgroundLocationOptions {
	data?: any;
	callback?: LocationCallback;
	backgroundIndicator?: boolean;
	pauseAutomatically?: boolean;
	distanceFilter?: number;
	desiredAccuracy?: 'best' | 'bestForNavigation' | 'nearestTenMeters' | 'hundredMeters' | 'kilometer' | 'threeKilometers';
	activityType?: 'other' | 'automotiveNavigation' | 'fitness' | 'otherNavigation';
	apiUrl?: string;
	timeout?: number;
}

export interface BackgroundLocationIosMessage {
	action: string;
	data?: any;
	backgroundIndicator?: boolean;
	pauseAutomatically?: boolean;
	distanceFilter?: number;
	desiredAccuracy?: string;
	activityType?: string;
	apiUrl?: string;
	timeout?: number;
}