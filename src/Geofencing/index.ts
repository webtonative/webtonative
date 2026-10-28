import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import {
	GeofenceRemoveZoneOptions,
	GeofenceWebhookOptions,
	GeofenceZoneOptions,
	GeofencingCallback,
	GeofencingIosMessage,
	GeofencingOptions,
	GeofencingResponse,
} from "./types";

const NOT_NATIVE_ERROR = "This function will work in Native App Powered By WebToNative";

/**
 * Registers a one-shot listener for `action`, triggers the native call and resolves with the response.
 * `androidArg` is passed as-is to the Android bridge (omit for no-arg methods);
 * `iosData` is spread into the iOS postMessage payload.
 */
const callGeofencing = (
	action: string,
	callback?: GeofencingCallback,
	androidArg?: string,
	iosData: Omit<GeofencingIosMessage, "action"> = {}
): Promise<GeofencingResponse> => {
	return new Promise((resolve, reject) => {
		if (!["ANDROID_APP", "IOS_APP"].includes(platform)) {
			reject(NOT_NATIVE_ERROR);
			return;
		}

		registerCb(
			(response: GeofencingResponse) => {
				if (response.type === action) {
					callback && callback(response);
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
			androidArg !== undefined ? webToNative[action](androidArg) : webToNative[action]();
		} else if (webToNativeIos) {
			webToNativeIos.postMessage({ action, ...iosData } as GeofencingIosMessage);
		}
	});
};

/**
 * Starts geofence monitoring. Registers the zones from the active source (dashboard, API or
 * previously added JS zones) — on Android only when location permission is already granted, on iOS
 * it also asks for "Always" location authorization.
 *
 * Use `requestPermission` to trigger the OS permission prompt on Android.
 * @example
 * wtn.Geofencing.start().then((res) => console.log(res));
 */
export const start = (options: GeofencingOptions = {}): Promise<GeofencingResponse> => {
	const { callback } = options;
	return callGeofencing("startGeofencing", callback);
};

/**
 * Requests the location permission geofencing needs — foreground then background location on
 * Android (followed by the battery-optimization exemption prompt), "Always" authorization on iOS.
 * @example
 * wtn.Geofencing.requestPermission().then((res) => console.log(res.status));
 */
export const requestPermission = (options: GeofencingOptions = {}): Promise<GeofencingResponse> => {
	const { callback } = options;
	return callGeofencing("requestGeofenceLocationPermission", callback);
};

/**
 * Reads the current location permission status without prompting the user.
 * @example
 * wtn.Geofencing.getPermissionStatus().then((res) => console.log(res.status));
 */
export const getPermissionStatus = (options: GeofencingOptions = {}): Promise<GeofencingResponse> => {
	const { callback } = options;
	return callGeofencing("getGeofencePermissionStatus", callback);
};

/**
 * Opens the app's Settings page so the user can change the location permission manually.
 * iOS only — on Android use `wtn.Permission.open({ permission: "location_always" })`.
 */
export const openLocationSettings = (): void => {
	if (platform !== "IOS_APP") return;

	webToNativeIos &&
		webToNativeIos.postMessage({
			action: "openGeofenceLocationSettings",
		} as GeofencingIosMessage);
};

/**
 * Adds a zone, or updates the existing zone with the same `id`, then re-syncs monitoring.
 * @example
 * wtn.Geofencing.addZone({
 *   zone: { id: "store-1", name: "Downtown store", lat: 28.6139, lng: 77.209, radius: 150, triggers: ["enter", "exit"] },
 * }).then((res) => console.log(res));
 */
export const addZone = (options: GeofenceZoneOptions): Promise<GeofencingResponse> => {
	const { zone, callback } = options || ({} as GeofenceZoneOptions);
	if (!zone) return Promise.reject("zone is required");

	return callGeofencing("addGeofenceZone", callback, JSON.stringify(zone), { zone });
};

/**
 * Stops monitoring a zone and removes its stored metadata.
 * @example
 * wtn.Geofencing.removeZone({ id: "store-1" }).then((res) => console.log(res));
 */
export const removeZone = (options: GeofenceRemoveZoneOptions): Promise<GeofencingResponse> => {
	const { id, callback } = options || ({} as GeofenceRemoveZoneOptions);
	return callGeofencing("removeGeofenceZone", callback, id, { zoneId: id });
};

/**
 * Returns the zones currently being monitored, with their full metadata.
 * @example
 * wtn.Geofencing.getActiveZones().then((res) => console.log(res.zones));
 */
export const getActiveZones = (options: GeofencingOptions = {}): Promise<GeofencingResponse> => {
	const { callback } = options;
	return callGeofencing("getActiveGeofenceZones", callback);
};

/**
 * Stops monitoring every zone and clears all stored zone data.
 * @example
 * wtn.Geofencing.clearAllZones().then((res) => console.log(res));
 */
export const clearAllZones = (options: GeofencingOptions = {}): Promise<GeofencingResponse> => {
	const { callback } = options;
	return callGeofencing("clearAllGeofenceZones", callback);
};

/**
 * Re-syncs zones from the active source — refetches from the API (api mode), re-applies the
 * dashboard zones (dashboard mode), or re-asserts the existing registrations (js_bridge mode).
 * @example
 * wtn.Geofencing.refreshZones().then((res) => console.log(res));
 */
export const refreshZones = (options: GeofencingOptions = {}): Promise<GeofencingResponse> => {
	const { callback } = options;
	return callGeofencing("refreshGeofenceZones", callback);
};

/**
 * Sets (or merges into) the webhook called when a geofence trigger fires.
 * @example
 * wtn.Geofencing.setWebhook({
 *   url: "https://example.com/geofence",
 *   headers: { Authorization: "Bearer token" },
 * }).then((res) => console.log(res));
 */
export const setWebhook = (options: GeofenceWebhookOptions): Promise<GeofencingResponse> => {
	const { url, headers, userContext, callback } = options || ({} as GeofenceWebhookOptions);
	return callGeofencing(
		"setGeofenceWebhook",
		callback,
		JSON.stringify({ url, headers, userContext }),
		{ url, headers }
	);
};

/**
 * Clears the webhook config set from the JS bridge.
 * @example
 * wtn.Geofencing.removeWebhook().then((res) => console.log(res));
 */
export const removeWebhook = (options: GeofencingOptions = {}): Promise<GeofencingResponse> => {
	const { callback } = options;
	return callGeofencing("removeGeofenceWebhook", callback);
};

export default {
	start,
	requestPermission,
	getPermissionStatus,
	openLocationSettings,
	addZone,
	removeZone,
	getActiveZones,
	clearAllZones,
	refreshZones,
	setWebhook,
	removeWebhook,
};
