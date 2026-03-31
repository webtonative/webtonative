// Define types for OneSignal module

// Response from getPlayerId
export interface PlayerIdResponse {
	isSuccess: boolean;
	playerId?: string;
	[key: string]: any;
}

// Response for trigger operations
export interface TriggerResponse {
	type: string;
	[key: string]: any;
}

// Callback for trigger operations
export interface TriggerCallback {
	(response: TriggerResponse): void;
}

// Options for trigger operations
export interface TriggerOptions {
	key?: string;
	value?: any;
	keys?: string[];
	triggers?: Record<string, any>;
	callback?: TriggerCallback;
}

// Options for tags
export interface TagsOptions {
	tags: Record<string, any>;
}

// Options for email operations
export interface EmailOptions {
	emailId?: string;
}

// Options for SMS operations
export interface SMSOptions {
	smsNumber?: string;
}

// Response from getPermissionStatus
export interface PermissionStatusResponse {
	status: "granted" | "denied" | "default";
}

// Response from requestPermission
export interface RequestPermissionResponse {
	accepted: boolean;
}

// Response from getSubscriptionStatus
export interface SubscriptionStatusResponse {
	isOptedIn: boolean;
	pushToken?: string;
	playerId?: string;
}

// Message structure for iOS
export interface OneSignalIosMessage {
	action: string;
	userId?: string;
	key?: string;
	value?: any;
	keys?: string[];
	triggers?: Record<string, any>;
	tags?: Record<string, any>;
	emailId?: string;
	smsNumber?: string;
	[key: string]: any;
}
