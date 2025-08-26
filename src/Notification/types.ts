export interface NotificationResponse {
	type: string;
	[key: string]: any;
}

export interface NotificationCallback {
	(response: NotificationResponse): void;
}

export interface NotificationOptions {
	callback?: NotificationCallback;
}

export interface NotificationIosMessage {
	action: string;
}