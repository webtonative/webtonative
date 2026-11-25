import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import {
	CallsAudioRoutesResponse,
	CallsCallIdParams,
	CallsCallResponse,
	CallsEvent,
	CallsOpenSettingsParams,
	CallsPendingEventsResponse,
	CallsPermissionsResponse,
	CallsRegisterResponse,
	CallsRequestPermissionsParams,
	CallsResponse,
	CallsSetAudioRouteParams,
	CallsSetAuthTokenParams,
	CallsSetMutedParams,
	CallsSetVideoEnabledParams,
	CallsStartCallParams,
	CallsStatusResponse,
} from "./types";

const NOT_NATIVE_ERROR = "This function will work in Native App Powered By WebToNative";

/**
 * Registers a one-shot listener for `action`, triggers the native call and resolves with the response.
 * Android: params are always sent as one JSON string — no-param methods get "{}" (no argument fails).
 * iOS: params are spread into the postMessage payload.
 * Failures resolve too, with `success: false` and a `code`. Android builds without the calls module
 * reply `{ success: false, error: "feature_unavailable" }`; that is resolved with `code: "NOT_SUPPORTED"`.
 */
const callCalls = <T extends CallsResponse>(action: string, params: object = {}): Promise<T> => {
	return new Promise((resolve, reject) => {
		if (!["ANDROID_APP", "IOS_APP"].includes(platform)) {
			reject(NOT_NATIVE_ERROR);
			return;
		}

		registerCb(
			(response: T) => {
				if (response.type === action) {
					if (response.success === false && response.error === "feature_unavailable") {
						(response as CallsResponse).code = "NOT_SUPPORTED";
					}
					resolve(response);
				}
			},
			{ key: action }
		);

		if (platform === "ANDROID_APP") {
			if (!webToNative[action]) {
				reject(`${action} is not supported in this app version`);
				return;
			}
			webToNative[action](JSON.stringify(params));
		} else if (webToNativeIos) {
			webToNativeIos.postMessage({ action, ...params });
		}
	});
};

/* ---------- Events ---------- */

type CallsEventHandler = (event: CallsEvent) => void;
const eventHandlers: CallsEventHandler[] = [];
let eventsRegistered = false;

/**
 * Listens for events native sends on its own (`incomingCall`, `callConnected`, `callEnded`, …).
 * Returns a function that removes the listener.
 * Events that happened while the page wasn't loaded come from `getPendingEvents` instead.
 * @example
 * const off = wtn.Calls.onEvent(({ event, data }) => {
 *   if (event === "callEnded") console.log(data.reason, data.durationSec);
 * });
 */
export const onEvent = (handler: CallsEventHandler): (() => void) => {
	if (typeof handler === "function") {
		eventHandlers.push(handler);
	}
	if (!eventsRegistered) {
		eventsRegistered = true;
		registerCb(
			(response: CallsEvent) => {
				if (response && response.type === "callsEvent") {
					eventHandlers.slice().forEach((h) => h(response));
				}
			},
			{ key: "callsEvent", ignoreDelete: true }
		);
	}
	return () => offEvent(handler);
};

/**
 * Removes a listener added with `onEvent`. With no handler, removes all of them.
 * @example
 * wtn.Calls.offEvent(handler);
 */
export const offEvent = (handler?: CallsEventHandler): void => {
	if (!handler) {
		eventHandlers.length = 0;
		return;
	}
	const index = eventHandlers.indexOf(handler);
	if (index > -1) {
		eventHandlers.splice(index, 1);
	}
};

/* ---------- Functions ---------- */

/**
 * Reports whether calling is available. Works even when calling is turned off — call it first.
 * @example
 * wtn.Calls.getStatus().then((res) => console.log(res.enabled, res.video, res.registered));
 */
export const getStatus = (): Promise<CallsStatusResponse> => {
	return callCalls<CallsStatusResponse>("callsGetStatus");
};

/**
 * Gets this device's call push token (also asks for notification permission on iOS and Android 13+).
 * Send `callPushToken` and `deviceId` to your backend for the logged-in user.
 * @example
 * wtn.Calls.register().then((res) => console.log(res.callPushToken, res.deviceId));
 */
export const register = (): Promise<CallsRegisterResponse> => {
	return callCalls<CallsRegisterResponse>("callsRegister");
};

/**
 * Stops this device from ringing. Call it on logout.
 * @example
 * wtn.Calls.unregister().then((res) => console.log(res.success));
 */
export const unregister = (): Promise<CallsResponse> => {
	return callCalls("callsUnregister");
};

/**
 * Sets the bearer token native sends to `tokenEndpoint` when the user answers a call.
 * Call it after login and whenever the session token changes.
 * @example
 * wtn.Calls.setAuthToken({ token: "session-token" }).then((res) => console.log(res.success));
 */
export const setAuthToken = (params: CallsSetAuthTokenParams): Promise<CallsResponse> => {
	return callCalls("callsSetAuthToken", params);
};

/**
 * Reports the current permission state without prompting.
 * @example
 * wtn.Calls.checkPermissions().then((res) => console.log(res.permissions));
 */
export const checkPermissions = (): Promise<CallsPermissionsResponse> => {
	return callCalls<CallsPermissionsResponse>("callsCheckPermissions");
};

/**
 * Shows the system prompts for the listed permissions and resolves with the state afterwards.
 * Ask for the microphone while the app is open — iOS can't prompt on the lock screen.
 * @example
 * wtn.Calls.requestPermissions({ permissions: ["microphone", "camera", "notifications"] })
 *   .then((res) => console.log(res.permissions));
 */
export const requestPermissions = (params: CallsRequestPermissionsParams): Promise<CallsPermissionsResponse> => {
	return callCalls<CallsPermissionsResponse>("callsRequestPermissions", params);
};

/**
 * Opens a system settings screen. `target`: "app" (default) | "fullScreenIntent" | "batteryOptimization" | "autostart".
 * @example
 * wtn.Calls.openSettings({ target: "autostart" });
 */
export const openSettings = (params: CallsOpenSettingsParams = {}): Promise<CallsResponse> => {
	return callCalls("callsOpenSettings", params);
};

/**
 * Starts an outgoing call. Your backend creates the call first and returns `callId`, `roomName`,
 * `livekitUrl` and the caller's LiveKit `token`. The callee hasn't answered when this resolves —
 * wait for the `callConnected` event.
 * @example
 * wtn.Calls.startCall({
 *   callId: "6f1c2a3e-…",
 *   roomName: "room-123",
 *   livekitUrl: "wss://x.livekit.cloud",
 *   token: "eyJ…",
 *   calleeName: "Bob",
 *   hasVideo: false,
 * }).then((res) => console.log(res.call));
 */
export const startCall = (params: CallsStartCallParams): Promise<CallsCallResponse> => {
	return callCalls<CallsCallResponse>("callsStartCall", params);
};

/**
 * Answers the ringing incoming call (only needed for an in-page answer button).
 * `callId` is required on iOS; Android defaults to the active call.
 * @example
 * wtn.Calls.answerCall({ callId }).then((res) => console.log(res.success));
 */
export const answerCall = (params: CallsCallIdParams = {}): Promise<CallsResponse> => {
	return callCalls("callsAnswerCall", params);
};

/**
 * Declines the ringing incoming call.
 * @example
 * wtn.Calls.declineCall({ callId }).then((res) => console.log(res.success));
 */
export const declineCall = (params: CallsCallIdParams = {}): Promise<CallsResponse> => {
	return callCalls("callsDeclineCall", params);
};

/**
 * Hangs up the active call (counts as a decline while ringing).
 * @example
 * wtn.Calls.endCall({ callId }).then((res) => console.log(res.success));
 */
export const endCall = (params: CallsCallIdParams = {}): Promise<CallsResponse> => {
	return callCalls("callsEndCall", params);
};

/**
 * Mutes or unmutes the microphone.
 * @example
 * wtn.Calls.setMuted({ callId, muted: true }).then((res) => console.log(res.success));
 */
export const setMuted = (params: CallsSetMutedParams): Promise<CallsResponse> => {
	return callCalls("callsSetMuted", params);
};

/**
 * Turns the local camera on or off.
 * @example
 * wtn.Calls.setVideoEnabled({ callId, enabled: true }).then((res) => console.log(res.success));
 */
export const setVideoEnabled = (params: CallsSetVideoEnabledParams): Promise<CallsResponse> => {
	return callCalls("callsSetVideoEnabled", params);
};

/**
 * Switches between the front and back camera.
 * @example
 * wtn.Calls.switchCamera({ callId }).then((res) => console.log(res.success));
 */
export const switchCamera = (params: CallsCallIdParams = {}): Promise<CallsResponse> => {
	return callCalls("callsSwitchCamera", params);
};

/**
 * Lists the audio outputs available now (Android returns an empty list with no active call).
 * @example
 * wtn.Calls.getAudioRoutes().then((res) => console.log(res.routes));
 */
export const getAudioRoutes = (): Promise<CallsAudioRoutesResponse> => {
	return callCalls<CallsAudioRoutesResponse>("callsGetAudioRoutes");
};

/**
 * Switches audio to a route `id` from `getAudioRoutes`.
 * @example
 * wtn.Calls.setAudioRoute({ callId, routeId: "speaker" }).then((res) => console.log(res.success));
 */
export const setAudioRoute = (params: CallsSetAudioRouteParams): Promise<CallsResponse> => {
	return callCalls("callsSetAudioRoute", params);
};

/**
 * Returns the call in progress (`call: null` when there is none). Use it on page load to restore call UI.
 * @example
 * wtn.Calls.getActiveCall().then((res) => console.log(res.call));
 */
export const getActiveCall = (): Promise<CallsCallResponse> => {
	return callCalls<CallsCallResponse>("callsGetActiveCall");
};

/**
 * Returns the events that happened while the page wasn't loaded, oldest first, then clears them.
 * Call it on every page load.
 * @example
 * wtn.Calls.getPendingEvents().then((res) => res.events?.forEach((e) => console.log(e.event, e.data)));
 */
export const getPendingEvents = (): Promise<CallsPendingEventsResponse> => {
	return callCalls<CallsPendingEventsResponse>("callsGetPendingEvents");
};
