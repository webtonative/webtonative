/** Error codes returned in `code` when `success` is `false`. */
export type CallsErrorCode =
	| "NOT_SUPPORTED"
	| "PERMISSION_DENIED"
	| "NO_ACTIVE_CALL"
	| "CALL_IN_PROGRESS"
	| "INVALID_ARGUMENT"
	| "CONNECT_FAILED"
	| "REGISTRATION_FAILED";

/** Every native reply has `type` set to the bridge method name and a `success` flag. */
export interface CallsResponse {
	type: string;
	success: boolean;
	/** Set when `success` is `false`. */
	code?: CallsErrorCode | string;
	message?: string;
	/** Android only, when the calls module isn't in the build (`"feature_unavailable"`). */
	error?: string;
	[key: string]: any;
}

export interface CallsCallback<T extends CallsResponse = CallsResponse> {
	(response: T): void;
}

export interface CallsOptions<T extends CallsResponse = CallsResponse> {
	callback?: CallsCallback<T>;
}

export type CallDirection = "incoming" | "outgoing";
export type CallState = "ringing" | "connecting" | "connected" | "reconnecting" | "ended";

export interface Call {
	callId: string;
	direction: CallDirection;
	/** `null` on outgoing calls. */
	callerId: string | null;
	/** On outgoing calls, the `calleeName` passed to `startCall`. */
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

export type AudioRouteType = "earpiece" | "speaker" | "bluetooth" | "wired";

export interface AudioRoute {
	/** Pass to `setAudioRoute` unchanged. */
	id: string;
	type: AudioRouteType;
	name: string;
	active: boolean;
}

export type PermissionState = "granted" | "denied" | "not_determined";
export type RequestablePermission = "microphone" | "camera" | "notifications";

export interface CallsPermissions {
	microphone: PermissionState;
	camera: PermissionState;
	notifications: PermissionState;
	/** Android 14+. Always `"granted"` below 14 and on iOS. */
	fullScreenIntent: PermissionState;
	/** Android only. Always `"granted"` on iOS. */
	batteryOptimizationExempt: PermissionState;
}

export type SettingsTarget = "app" | "fullScreenIntent" | "batteryOptimization" | "autostart";

/* ---------- responses ---------- */

export interface CallsStatusResponse extends CallsResponse {
	enabled?: boolean;
	video?: boolean;
	registered?: boolean;
	platform?: "android" | "ios";
}

export interface CallsRegisterResponse extends CallsResponse {
	platform?: "android" | "ios";
	/** FCM token on Android, PushKit VoIP token (hex) on iOS. */
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

export interface PendingCallsEvent {
	event: CallsEventName;
	data: any;
	/** ms */
	at: number;
}

export interface CallsPendingEventsResponse extends CallsResponse {
	events?: PendingCallsEvent[];
}

/* ---------- params ---------- */

export interface SetAuthTokenOptions extends CallsOptions {
	/** Sent as `Authorization: Bearer <token>` to `tokenEndpoint` when a call is answered. */
	token: string;
}

export interface RequestPermissionsOptions extends CallsOptions<CallsPermissionsResponse> {
	permissions: RequestablePermission[];
}

export interface OpenSettingsOptions extends CallsOptions {
	/** Default `"app"`. Non-`app` targets are Android only; iOS always opens app settings. */
	target?: SettingsTarget;
}

export interface StartCallOptions extends CallsOptions<CallsCallResponse> {
	/** Must be a UUID on iOS. */
	callId: string;
	roomName: string;
	/** `wss://…` */
	livekitUrl: string;
	/** The caller's LiveKit token. */
	token: string;
	/** Shown in the call UI. Up to 64 characters on Android. */
	calleeName?: string;
	/** Default `false`. */
	hasVideo?: boolean;
	/** Returned in events and sent to `callbackUrl`. */
	metadata?: Record<string, any>;
}

export interface CallIdOptions extends CallsOptions {
	/** Required on iOS. Android defaults to the active call. */
	callId?: string;
}

export interface SetMutedOptions extends CallIdOptions {
	muted: boolean;
}

export interface SetVideoEnabledOptions extends CallIdOptions {
	enabled: boolean;
}

export interface SetAudioRouteOptions extends CallIdOptions {
	/** A route's `id` from `getAudioRoutes`. */
	routeId: string;
}

export interface GetStatusOptions extends CallsOptions<CallsStatusResponse> {
	/**
	 * iOS app versions without calling never reply. After this many ms, `getStatus` resolves with
	 * `{ success: false, code: "NOT_SUPPORTED" }`. Default 5000. Pass 0 to wait forever.
	 */
	timeout?: number;
}

/* ---------- events ---------- */

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

export interface CallsEventDataMap {
	tokenUpdated: { platform: "android" | "ios"; callPushToken: string };
	incomingCall: Call;
	callAccepted: Call;
	callConnected: Call & { connectedAt: number };
	callDeclined: Call;
	callMissed: Call;
	callEnded: Call & { reason: CallEndReason; durationSec: number };
	muteChanged: { callId: string; muted: boolean };
	/** Android sends a Route object, iOS sends its `type` string. */
	audioRouteChanged: { callId: string; route: AudioRoute | AudioRouteType };
	connectionQuality: {
		callId: string;
		quality: "excellent" | "good" | "poor" | "lost" | "unknown";
	};
	reconnecting: { callId: string };
	reconnected: { callId: string };
	participantVideoChanged: { callId: string; enabled: boolean };
}

/** Raw event message from native. */
export interface CallsEventMessage {
	type: "callsEvent";
	event: CallsEventName;
	data: any;
}

export type CallsEventHandler<E extends CallsEventName = CallsEventName> = (
	data: CallsEventDataMap[E],
	event: E
) => void;

/** Handler for `"*"`: receives every event. */
export type CallsAnyEventHandler = (data: any, event: CallsEventName) => void;
