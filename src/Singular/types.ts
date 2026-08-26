export interface SingularResponse {
	type: string;
	isSuccess?: boolean;
	[key: string]: any;
}

export interface SingularCallback {
	(response: SingularResponse): void;
}

/** Every call takes at least an optional callback. */
export interface SingularCallbackOptions {
	callback?: SingularCallback;
}

export interface SingularCustomUserIdOptions extends SingularCallbackOptions {
	/** The id Singular should attribute this user by */
	userId: string;
}

export interface SingularGlobalPropertyOptions extends SingularCallbackOptions {
	key: string;
	value: string;
	/** Replaces the value when the key is already set. Defaults to true. */
	overrideExisting?: boolean;
}

export interface SingularUnsetGlobalPropertyOptions extends SingularCallbackOptions {
	key: string;
}

export interface SingularEventOptions extends SingularCallbackOptions {
	eventName: string;
	/** Free form attributes sent along with the event */
	eventJson?: Record<string, any>;
	/** Singular standard event values */
	eventValues?: any[];
}

export interface SingularEventParams {
	eventName: string;
	eventJson?: Record<string, any>;
	eventValues?: any[];
}

/** Standard in app revenue — currency and amount are what Singular expects. */
export interface SingularRevenue {
	currency?: string;
	amount?: number;
	[key: string]: any;
}

/** Revenue reported against an event name of your own. */
export interface SingularCustomRevenue extends SingularRevenue {
	eventName?: string;
}

/** Revenue coming from an ad network mediation callback. */
export interface SingularAdRevenue extends SingularRevenue {
	adPlatform?: string;
	[key: string]: any;
}

export interface SingularRevenueOptions extends SingularCallbackOptions {
	revenue?: SingularRevenue;
	customRevenue?: SingularCustomRevenue;
	adRevenue?: SingularAdRevenue;
}

export interface SingularRevenueParams {
	revenue?: SingularRevenue;
	customRevenue?: SingularCustomRevenue;
	adRevenue?: SingularAdRevenue;
}

export interface SingularReferrerShortLinkOptions extends SingularCallbackOptions {
	/** The Singular link the short link is built from */
	baseLink: string;
	referrerName: string;
	referrerId: string;
	/** Extra params carried through to the app on install */
	passthroughParams?: Record<string, any>;
}

export interface SingularReferrerShortLinkParams {
	baseLink: string;
	referrerName: string;
	referrerId: string;
	passthroughParams?: Record<string, any>;
}

export interface SingularLimitDataSharingOptions extends SingularCallbackOptions {
	/** true stops Singular sharing this user's data downstream */
	shouldLimit: boolean;
}

export interface SingularFCMTokenOptions extends SingularCallbackOptions {
	token: string;
}

export interface SingularIMEIOptions extends SingularCallbackOptions {
	imei: string;
}

export interface SingularIosMessage {
	action: string;
	userId?: string;
	key?: string;
	value?: string;
	overrideExisting?: boolean;
	eventName?: string;
	eventJson?: Record<string, any>;
	eventValues?: any[];
	revenue?: SingularRevenue;
	customRevenue?: SingularCustomRevenue;
	adRevenue?: SingularAdRevenue;
	baseLink?: string;
	referrerName?: string;
	referrerId?: string;
	passthroughParams?: Record<string, any>;
	shouldLimit?: boolean;
	token?: string;
	imei?: string;
}
