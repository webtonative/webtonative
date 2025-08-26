// Common Firebase types

export interface FirebaseAnalyticsCollectionOptions {
	enabled: boolean;
}

export interface FirebaseUserIdOptions {
	userId: string;
}

export interface FirebaseUserPropertyOptions {
	key: string;
	value: string;
}

export interface FirebaseEventParameters {
	[key: string]: any;
}

export interface FirebaseDefaultParametersOptions {
	parameters: FirebaseEventParameters;
}

export interface FirebaseEventOptions {
	eventName: string;
	parameters?: FirebaseEventParameters;
}

export interface FirebaseScreenOptions {
	screenName: string;
	screenClass?: string;
}

export interface FirebaseAnalyticsIosMessage {
	action: string;
	enabled?: boolean;
	userId?: string;
	key?: string;
	value?: string;
	parameters?: FirebaseEventParameters;
	eventName?: string;
	screenName?: string;
	screenClass?: string;
}

// Firebase Messaging types

export interface FirebaseTopicSubscriptionOptions {
	toTopic: string;
}

export interface FirebaseTopicUnsubscriptionOptions {
	fromTopic: string;
}

export interface FirebaseFCMTokenResponse {
	type: string;
	token?: string;
	fcm_registration_token?: string;
	[key: string]: any;
}

export interface FirebaseFCMTokenCallback {
	(response: FirebaseFCMTokenResponse): void;
}

export interface FirebaseFCMTokenOptions {
	callback?: FirebaseFCMTokenCallback;
}

export interface FirebaseMessagingIosMessage {
	action: string;
	topic?: string;
}