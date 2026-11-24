import { isNativeApp, platform, registerCb, webToNative, webToNativeIos } from "../utills";
import {
	CallIdOptions,
	CallsAnyEventHandler,
	CallsAudioRoutesResponse,
	CallsCallResponse,
	CallsEventHandler,
	CallsEventMessage,
	CallsEventName,
	CallsOptions,
	CallsPendingEventsResponse,
	CallsPermissionsResponse,
	CallsRegisterResponse,
	CallsResponse,
	CallsStatusResponse,
	GetStatusOptions,
	OpenSettingsOptions,
	RequestPermissionsOptions,
	SetAudioRouteOptions,
	SetAuthTokenOptions,
	SetMutedOptions,
	SetVideoEnabledOptions,
	StartCallOptions,
} from "./types";

const NOT_NATIVE_ERROR = "This function will work in Native App Powered By WebToNative";
const EVENT_TYPE = "callsEvent";

/*
 * Replies are matched to calls by `type` (the method name). The shared callback registry holds
 * one callback per key, so concurrent calls to the same method (e.g. two quick `setMuted`) would
 * drop the earlier promise. Instead each method keeps a FIFO of waiting resolvers and one
 * persistent registry callback that hands each reply to the oldest waiter.
 */
const waiting: Record<string, Array<(response: CallsResponse) => void>> = {};

const takeWaiter = (method: string, response: CallsResponse): void => {
	const queue = waiting[method];
	const next = queue && queue.shift();
	next && next(response);
};

const normalize = (method: string, response: any): CallsResponse => {
	const res: CallsResponse = response && typeof response === "object" ? response : { type: method, success: false };
	// Android without the calls module replies `{ success: false, error: "feature_unavailable" }`.
	if (res.success === false && !res.code && res.error === "feature_unavailable") {
		res.code = "NOT_SUPPORTED";
	}
	return res;
};

const unsupported = (method: string, message: string): CallsResponse => ({
	type: method,
	success: false,
	code: "NOT_SUPPORTED",
	message,
});

/** postMessage can't carry `undefined`; drop those keys so native sees them as absent. */
const stripUndefined = (obj: Record<string, any>): Record<string, any> => {
	const out: Record<string, any> = {};
	Object.keys(obj).forEach((k) => {
		if (obj[k] !== undefined) out[k] = obj[k];
	});
	return out;
};

/**
 * Sends `method` to native with `params` and resolves with the reply. Native errors resolve too
 * (check `success` / `code`); only a non-native environment rejects.
 */
const callNative = <T extends CallsResponse>(
	method: string,
	params: Record<string, any> = {},
	callback?: (response: T) => void,
	timeoutMs: number = 0
): Promise<T> => {
	return new Promise<T>((resolve, reject) => {
		if (!isNativeApp) {
			reject(NOT_NATIVE_ERROR);
			return;
		}

		let done = false;
		let timer: ReturnType<typeof setTimeout> | null = null;
		const finish = (response: CallsResponse) => {
			if (done) return;
			done = true;
			timer && clearTimeout(timer);
			const res = normalize(method, response) as T;
			callback && callback(res);
			resolve(res);
		};

		const clean = stripUndefined(params);

		if (platform === "ANDROID_APP" && typeof webToNative[method] !== "function") {
			finish(unsupported(method, `${method} is not supported in this app version`));
			return;
		}

		if (!waiting[method]) waiting[method] = [];
		waiting[method].push(finish);
		registerCb((response: CallsResponse) => {
			if (response && response.type === method) takeWaiter(method, response);
		}, { key: method, ignoreDelete: true });

		if (timeoutMs > 0) {
			timer = setTimeout(() => {
				const queue = waiting[method];
				const i = queue ? queue.indexOf(finish) : -1;
				if (i !== -1) queue.splice(i, 1);
				finish(unsupported(method, `No reply to ${method} within ${timeoutMs} ms`));
			}, timeoutMs);
		}

		try {
			if (platform === "ANDROID_APP") {
				// Every Android calls method takes a JSON string; no-param methods need "{}".
				webToNative[method](JSON.stringify(clean));
			} else if (webToNativeIos) {
				webToNativeIos.postMessage({ ...clean, action: method });
			}
		} catch (e) {
			const queue = waiting[method];
			const i = queue ? queue.indexOf(finish) : -1;
			if (i !== -1) queue.splice(i, 1);
			finish({ type: method, success: false, code: "NOT_SUPPORTED", message: String(e) });
		}
	});
};

/* ======================================================================= */
/* Events                                                                   */
/* ======================================================================= */

const listeners: Record<string, Array<{ handler: Function; once: boolean }>> = {};

const dispatch = (event: string, data: any): void => {
	[event, "*"].forEach((key) => {
		const list = listeners[key];
		if (!list) return;
		list.slice().forEach((entry) => {
			if (entry.once) {
				listeners[key] = listeners[key].filter((e) => e !== entry);
			}
			try {
				entry.handler(data, event);
			} catch (e) {
				console.error(e);
			}
		});
	});
};

if (isNativeApp) {
	registerCb((message: CallsEventMessage) => {
		if (message && message.type === EVENT_TYPE && message.event) {
			dispatch(message.event, message.data);
		}
	}, { key: EVENT_TYPE, ignoreDelete: true });
}

/**
 * Listens for a call event pushed by native. Pass `"*"` to receive every event.
 * Returns a function that removes the listener.
 * @example
 * wtn.Calls.on("incomingCall", (call) => showRinging(call));
 * wtn.Calls.on("callEnded", (data) => console.log(data.reason, data.durationSec));
 */
export function on<E extends CallsEventName>(event: E, handler: CallsEventHandler<E>): () => void;
export function on(event: "*", handler: CallsAnyEventHandler): () => void;
export function on(event: string, handler: Function): () => void {
	if (!listeners[event]) listeners[event] = [];
	listeners[event].push({ handler, once: false });
	return () => off(event as any, handler as any);
}

/** Like `on`, but the listener is removed after it fires once. */
export function once<E extends CallsEventName>(event: E, handler: CallsEventHandler<E>): () => void;
export function once(event: "*", handler: CallsAnyEventHandler): () => void;
export function once(event: string, handler: Function): () => void {
	if (!listeners[event]) listeners[event] = [];
	listeners[event].push({ handler, once: true });
	return () => off(event as any, handler as any);
}

/** Removes a listener. Without `handler`, removes every listener for `event`. */
export function off<E extends CallsEventName>(event: E, handler?: CallsEventHandler<E>): void;
export function off(event: "*", handler?: CallsAnyEventHandler): void;
export function off(event: string, handler?: Function): void {
	if (!listeners[event]) return;
	listeners[event] = handler ? listeners[event].filter((e) => e.handler !== handler) : [];
	if (!listeners[event].length) delete listeners[event];
}

/* ======================================================================= */
/* Methods                                                                  */
/* ======================================================================= */

/**
 * Reports whether calling is available in this app. Works even when calling is turned off.
 * Call this first for feature detection.
 * @example
 * const { success, enabled } = await wtn.Calls.getStatus();
 */
export const getStatus = (options: GetStatusOptions = {}): Promise<CallsStatusResponse> => {
	const { callback, timeout = 5000 } = options;
	return callNative<CallsStatusResponse>("callsGetStatus", {}, callback, timeout);
};

/**
 * Gets this device's call push token. Send `callPushToken` and `deviceId` to your backend for
 * the logged-in user. Also asks for notification permission on iOS and Android 13+.
 */
export const register = (options: CallsOptions<CallsRegisterResponse> = {}): Promise<CallsRegisterResponse> =>
	callNative<CallsRegisterResponse>("callsRegister", {}, options.callback);

/** Stops this device from ringing. Call on logout, and delete the token on your backend too. */
export const unregister = (options: CallsOptions = {}): Promise<CallsResponse> =>
	callNative("callsUnregister", {}, options.callback);

/**
 * Sets the bearer token native sends to `tokenEndpoint` when the user answers a call.
 * Call after login and whenever the session token changes.
 */
export const setAuthToken = (options: SetAuthTokenOptions): Promise<CallsResponse> => {
	const { callback, token } = options || ({} as SetAuthTokenOptions);
	return callNative("callsSetAuthToken", { token }, callback);
};

/** Reports the current permission state without showing prompts. */
export const checkPermissions = (
	options: CallsOptions<CallsPermissionsResponse> = {}
): Promise<CallsPermissionsResponse> =>
	callNative<CallsPermissionsResponse>("callsCheckPermissions", {}, options.callback);

/**
 * Shows the system prompts for the listed permissions and resolves with the state afterwards.
 * Ask for the microphone while the app is open: iOS can't prompt on the lock screen.
 * @example
 * wtn.Calls.requestPermissions({ permissions: ["microphone", "notifications"] });
 */
export const requestPermissions = (options: RequestPermissionsOptions): Promise<CallsPermissionsResponse> => {
	const { callback, permissions } = options || ({} as RequestPermissionsOptions);
	return callNative<CallsPermissionsResponse>("callsRequestPermissions", { permissions }, callback);
};

/** Opens a system settings screen. Non-`app` targets are Android only. */
export const openSettings = (options: OpenSettingsOptions = {}): Promise<CallsResponse> => {
	const { callback, target } = options;
	return callNative("callsOpenSettings", { target }, callback);
};

/**
 * Starts an outgoing call. Your backend creates the call first and returns `callId`, `roomName`,
 * `livekitUrl` and the caller's LiveKit `token`. The callee hasn't answered when this resolves:
 * wait for the `callConnected` event.
 * @example
 * wtn.Calls.startCall({ callId, roomName, livekitUrl, token, calleeName: "Bob" });
 */
export const startCall = (options: StartCallOptions): Promise<CallsCallResponse> => {
	const { callback, ...params } = options || ({} as StartCallOptions);
	return callNative<CallsCallResponse>("callsStartCall", params, callback);
};

/** Answers the ringing incoming call. Only needed for an in-page answer button. */
export const answerCall = (options: CallIdOptions = {}): Promise<CallsResponse> => {
	const { callback, callId } = options;
	return callNative("callsAnswerCall", { callId }, callback);
};

/** Declines the ringing incoming call. */
export const declineCall = (options: CallIdOptions = {}): Promise<CallsResponse> => {
	const { callback, callId } = options;
	return callNative("callsDeclineCall", { callId }, callback);
};

/** Hangs up the active call. On a ringing incoming call it counts as a decline. */
export const endCall = (options: CallIdOptions = {}): Promise<CallsResponse> => {
	const { callback, callId } = options;
	return callNative("callsEndCall", { callId }, callback);
};

/** Mutes or unmutes the microphone. */
export const setMuted = (options: SetMutedOptions): Promise<CallsResponse> => {
	const { callback, callId, muted } = options || ({} as SetMutedOptions);
	return callNative("callsSetMuted", { callId, muted }, callback);
};

/** Turns the local camera on or off. */
export const setVideoEnabled = (options: SetVideoEnabledOptions): Promise<CallsResponse> => {
	const { callback, callId, enabled } = options || ({} as SetVideoEnabledOptions);
	return callNative("callsSetVideoEnabled", { callId, enabled }, callback);
};

/** Switches between the front and back camera. */
export const switchCamera = (options: CallIdOptions = {}): Promise<CallsResponse> => {
	const { callback, callId } = options;
	return callNative("callsSwitchCamera", { callId }, callback);
};

/** Lists the audio outputs available now. Android returns an empty list with no active call. */
export const getAudioRoutes = (
	options: CallsOptions<CallsAudioRoutesResponse> = {}
): Promise<CallsAudioRoutesResponse> =>
	callNative<CallsAudioRoutesResponse>("callsGetAudioRoutes", {}, options.callback);

/** Switches audio to one of the routes from `getAudioRoutes`. */
export const setAudioRoute = (options: SetAudioRouteOptions): Promise<CallsResponse> => {
	const { callback, callId, routeId } = options || ({} as SetAudioRouteOptions);
	return callNative("callsSetAudioRoute", { callId, routeId }, callback);
};

/** Returns the call in progress (`call: null` when none). Use on page load to restore call UI. */
export const getActiveCall = (options: CallsOptions<CallsCallResponse> = {}): Promise<CallsCallResponse> =>
	callNative<CallsCallResponse>("callsGetActiveCall", {}, options.callback);

/**
 * Returns the events that happened while the page wasn't loaded, oldest first, then clears them.
 * Call on every page load. Pass `dispatch: true` to also replay them to `on()` listeners.
 * @example
 * wtn.Calls.getPendingEvents({ dispatch: true });
 */
export const getPendingEvents = (
	options: CallsOptions<CallsPendingEventsResponse> & { dispatch?: boolean } = {}
): Promise<CallsPendingEventsResponse> => {
	const { callback, dispatch: replay = false } = options;
	return callNative<CallsPendingEventsResponse>("callsGetPendingEvents", {}, callback).then((res) => {
		if (replay && res.success && Array.isArray(res.events)) {
			res.events.forEach((e) => dispatch(e.event, e.data));
		}
		return res;
	});
};

export default {
	getStatus,
	register,
	unregister,
	setAuthToken,
	checkPermissions,
	requestPermissions,
	openSettings,
	startCall,
	answerCall,
	declineCall,
	endCall,
	setMuted,
	setVideoEnabled,
	switchCamera,
	getAudioRoutes,
	setAudioRoute,
	getActiveCall,
	getPendingEvents,
	on,
	once,
	off,
};
