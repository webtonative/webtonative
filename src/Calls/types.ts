export type CallsErrorCode =
	| "NOT_SUPPORTED"
	| "PERMISSION_DENIED"
	| "NO_ACTIVE_CALL"
	| "CALL_IN_PROGRESS"
	| "INVALID_ARGUMENT"
	| "CONNECT_FAILED"
	| "REGISTRATION_FAILED";

export interface CallsResponse {
	type: string;
	success: boolean;
	/** Set when `success` is false */
	code?: CallsErrorCode | string;
	message?: string;
	[key: string]: any;
}

export type CallState = "ringing" | "connecting" | "connected" | "reconnecting" | "ended";

export interface Call {
	callId: string;
	direction: "incoming" | "outgoing";
	callerId: string | null;
	callerName: string;
	hasVideo: boolean;
	roomName: string;
	state: CallState;
	metadata: Record<string, any> | null;
	/** ms */
	startedAt: number;
	[key: string]: any;
}

export type CallEndReason =
	| "local_hangup"
	| "remote_hangup"
	| "declined"
	| "no_answer"
	| "caller_cancelled"
	| "answered_elsewhere"
	| "network_lost"
	| "auth_failed"
	| "call_unavailable"
	| "permission_denied"
	| "failed";

export interface AudioRoute {
	/** Pass to `setAudioRoute` unchanged */
	id: string;
	type: "earpiece" | "speaker" | "bluetooth" | "wired";
	name: string;
	active: boolean;
}

export type PermissionState = "granted" | "denied" | "not_determined";

export interface CallsPermissions {
	microphone: PermissionState;
	camera: PermissionState;
	notifications: PermissionState;
	fullScreenIntent: PermissionState;
	batteryOptimizationExempt: PermissionState;
}

export type CallsPermissionName = "microphone" | "camera" | "notifications";

export type CallsSettingsTarget = "app" | "fullScreenIntent" | "batteryOptimization" | "autostart";

export type CallsEventName =
	| "tokenUpdated"
	| "incomingCall"
	| "callAccepted"
	| "callConnected"
	| "callDeclined"
	| "callMissed"
	| "callEnded"
	| "muteChanged"
	| "audioRouteChanged"
	| "connectionQuality"
	| "reconnecting"
	| "reconnected"
	| "participantVideoChanged";

export interface CallsEvent {
	type: "callsEvent";
	event: CallsEventName | string;
	data: any;
}

export interface CallsPendingEvent {
	event: CallsEventName | string;
	data: any;
	/** ms */
	at: number;
}

/* ---------- Params ---------- */

export interface CallsSetAuthTokenParams {
	/** Sent as `Authorization: Bearer <token>` */
	token: string;
}

export interface CallsRequestPermissionsParams {
	permissions: CallsPermissionName[];
}

export interface CallsOpenSettingsParams {
	/** Default "app" */
	target?: CallsSettingsTarget;
}

export interface CallsStartCallParams {
	/** Must be a UUID on iOS */
	callId: string;
	roomName: string;
	/** wss://… */
	livekitUrl: string;
	/** The caller's LiveKit token */
	token: string;
	/** Up to 64 characters on Android */
	calleeName?: string;
	/** Default false */
	hasVideo?: boolean;
	metadata?: Record<string, any>;
}

export interface CallsCallIdParams {
	/** iOS: required. Android: defaults to the active call */
	callId?: string;
}

export interface CallsSetMutedParams extends CallsCallIdParams {
	muted: boolean;
}

export interface CallsSetVideoEnabledParams extends CallsCallIdParams {
	enabled: boolean;
}

export interface CallsSetAudioRouteParams extends CallsCallIdParams {
	routeId: string;
}

/* ---------- Responses ---------- */

export interface CallsStatusResponse extends CallsResponse {
	enabled?: boolean;
	video?: boolean;
	registered?: boolean;
	platform?: "android" | "ios";
}

export interface CallsRegisterResponse extends CallsResponse {
	platform?: "android" | "ios";
	/** FCM token on Android, PushKit VoIP token (hex) on iOS */
	callPushToken?: string;
	deviceId?: string;
}

export interface CallsPermissionsResponse extends CallsResponse {
	permissions?: CallsPermissions;
}

export interface CallsCallResponse extends CallsResponse {
	call?: Call | null;
}

export interface CallsAudioRoutesResponse extends CallsResponse {
	routes?: AudioRoute[];
}

export interface CallsPendingEventsResponse extends CallsResponse {
	events?: CallsPendingEvent[];
}
