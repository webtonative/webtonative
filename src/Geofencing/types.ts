/** Events a zone can fire. */
export type GeofenceTrigger = "enter" | "exit" | "dwell";

/** Location permission state reported by the native layer. */
export type GeofencePermissionStatus =
	| "ALLOWED"
	| "NOT_ALLOWED"
	| "PERMANENTLY_BLOCKED"
	| "RESTRICTED"
	| "UNKNOWN_STATUS";

export interface GeofenceZone {
	/** Unique id of the zone. Adding a zone with an existing id updates it. */
	id: string;
	name?: string;
	/** Latitude of the zone centre. */
	lat: number;
	/** Longitude of the zone centre. */
	lng: number;
	/** Radius of the zone in metres. */
	radius: number;
	/** Which events this zone should fire. Defaults to the native default when omitted. */
	triggers?: GeofenceTrigger[];
	[key: string]: any;
}

export interface GeofencingResponse {
	type: string;
	[key: string]: any;
}

export interface GeofencingCallback {
	(response: GeofencingResponse): void;
}

export interface GeofencingOptions {
	callback?: GeofencingCallback;
}

export interface GeofenceZoneOptions {
	zone: GeofenceZone;
	callback?: GeofencingCallback;
}

export interface GeofenceRemoveZoneOptions {
	/** Id of the zone to stop monitoring. */
	id: string;
	callback?: GeofencingCallback;
}

export interface GeofenceWebhookOptions {
	/** URL called when a geofence trigger fires. */
	url: string;
	/** Headers sent with the webhook request. Android supports a single custom header. */
	headers?: Record<string, string>;
	/** Android only — arbitrary user context sent along with the webhook payload. */
	userContext?: Record<string, any>;
	callback?: GeofencingCallback;
}

export interface GeofencingIosMessage {
	action: string;
	zone?: GeofenceZone;
	zoneId?: string;
	url?: string;
	headers?: Record<string, string>;
}
