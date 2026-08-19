import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import {
	GeofenceRemoveZoneOptions,
	GeofenceWebhookOptions,
	GeofenceZoneOptions,
	GeofencingIosMessage,
	GeofencingOptions,
	GeofencingResponse,
} from "./types";

/**
 * Starts geofence monitoring. Registers the zones from the active source (dashboard, API or
 * previously added JS zones) — on Android only when location permission is already granted, on iOS
 * it also asks for "Always" location authorization.
 *
 * Use `requestPermission` to trigger the OS permission prompt on Android.
 * @example
 * wtn.Geofencing.start({ callback: (res) => console.log(res) });
 */
export const start = (options: GeofencingOptions = {}): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;

	const { callback } = options;

	registerCb(
		(response: GeofencingResponse) => {
			const { type } = response;
			if (type === "startGeofencing") {
				callback && callback(response);
			}
		},
		{ key: "startGeofencing" }
	);

	if (platform === "ANDROID_APP") {
		webToNative.startGeofencing && webToNative.startGeofencing();
	} else if (webToNativeIos) {
		webToNativeIos.postMessage({ action: "startGeofencing" } as GeofencingIosMessage);
	}
};

/**
 * Requests the location permission geofencing needs — foreground then background location on
 * Android (followed by the battery-optimization exemption prompt), "Always" authorization on iOS.
 * @example
 * wtn.Geofencing.requestPermission({ callback: (res) => console.log(res.status) });
 */
export const requestPermission = (options: GeofencingOptions = {}): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;

	const { callback } = options;

	registerCb(
		(response: GeofencingResponse) => {
			const { type } = response;
			if (type === "requestGeofenceLocationPermission") {
				callback && callback(response);
			}
		},
		{ key: "requestGeofenceLocationPermission" }
	);

	if (platform === "ANDROID_APP") {
		webToNative.requestGeofenceLocationPermission && webToNative.requestGeofenceLocationPermission();
	} else if (webToNativeIos) {
		webToNativeIos.postMessage({
			action: "requestGeofenceLocationPermission",
		} as GeofencingIosMessage);
	}
};

/**
 * Reads the current location permission status without prompting the user.
 * @example
 * wtn.Geofencing.getPermissionStatus({ callback: (res) => console.log(res.status) });
 */
export const getPermissionStatus = (options: GeofencingOptions = {}): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;

	const { callback } = options;

	registerCb(
		(response: GeofencingResponse) => {
			const { type } = response;
			if (type === "getGeofencePermissionStatus") {
				callback && callback(response);
			}
		},
		{ key: "getGeofencePermissionStatus" }
	);

	if (platform === "ANDROID_APP") {
		webToNative.getGeofencePermissionStatus && webToNative.getGeofencePermissionStatus();
	} else if (webToNativeIos) {
		webToNativeIos.postMessage({
			action: "getGeofencePermissionStatus",
		} as GeofencingIosMessage);
	}
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
 *   callback: (res) => console.log(res),
 * });
 */
export const addZone = (options: GeofenceZoneOptions): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;

	const { zone, callback } = options || ({} as GeofenceZoneOptions);
	if (!zone) return;

	registerCb(
		(response: GeofencingResponse) => {
			const { type } = response;
			if (type === "addGeofenceZone") {
				callback && callback(response);
			}
		},
		{ key: "addGeofenceZone" }
	);

	if (platform === "ANDROID_APP") {
		webToNative.addGeofenceZone && webToNative.addGeofenceZone(JSON.stringify(zone));
	} else if (webToNativeIos) {
		webToNativeIos.postMessage({ action: "addGeofenceZone", zone } as GeofencingIosMessage);
	}
};

/**
 * Stops monitoring a zone and removes its stored metadata.
 * @example
 * wtn.Geofencing.removeZone({ id: "store-1", callback: (res) => console.log(res) });
 */
export const removeZone = (options: GeofenceRemoveZoneOptions): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;

	const { id, callback } = options || ({} as GeofenceRemoveZoneOptions);

	registerCb(
		(response: GeofencingResponse) => {
			const { type } = response;
			if (type === "removeGeofenceZone") {
				callback && callback(response);
			}
		},
		{ key: "removeGeofenceZone" }
	);

	if (platform === "ANDROID_APP") {
		webToNative.removeGeofenceZone && webToNative.removeGeofenceZone(id);
	} else if (webToNativeIos) {
		webToNativeIos.postMessage({
			action: "removeGeofenceZone",
			zoneId: id,
		} as GeofencingIosMessage);
	}
};

/**
 * Returns the zones currently being monitored, with their full metadata.
 * @example
 * wtn.Geofencing.getActiveZones({ callback: (res) => console.log(res.zones) });
 */
export const getActiveZones = (options: GeofencingOptions = {}): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;

	const { callback } = options;

	registerCb(
		(response: GeofencingResponse) => {
			const { type } = response;
			if (type === "getActiveGeofenceZones") {
				callback && callback(response);
			}
		},
		{ key: "getActiveGeofenceZones" }
	);

	if (platform === "ANDROID_APP") {
		webToNative.getActiveGeofenceZones && webToNative.getActiveGeofenceZones();
	} else if (webToNativeIos) {
		webToNativeIos.postMessage({ action: "getActiveGeofenceZones" } as GeofencingIosMessage);
	}
};

/**
 * Stops monitoring every zone and clears all stored zone data.
 * @example
 * wtn.Geofencing.clearAllZones({ callback: (res) => console.log(res) });
 */
export const clearAllZones = (options: GeofencingOptions = {}): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;

	const { callback } = options;

	registerCb(
		(response: GeofencingResponse) => {
			const { type } = response;
			if (type === "clearAllGeofenceZones") {
				callback && callback(response);
			}
		},
		{ key: "clearAllGeofenceZones" }
	);

	if (platform === "ANDROID_APP") {
		webToNative.clearAllGeofenceZones && webToNative.clearAllGeofenceZones();
	} else if (webToNativeIos) {
		webToNativeIos.postMessage({ action: "clearAllGeofenceZones" } as GeofencingIosMessage);
	}
};

/**
 * Re-syncs zones from the active source — refetches from the API (api mode), re-applies the
 * dashboard zones (dashboard mode), or re-asserts the existing registrations (js_bridge mode).
 * @example
 * wtn.Geofencing.refreshZones({ callback: (res) => console.log(res) });
 */
export const refreshZones = (options: GeofencingOptions = {}): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;

	const { callback } = options;

	registerCb(
		(response: GeofencingResponse) => {
			const { type } = response;
			if (type === "refreshGeofenceZones") {
				callback && callback(response);
			}
		},
		{ key: "refreshGeofenceZones" }
	);

	if (platform === "ANDROID_APP") {
		webToNative.refreshGeofenceZones && webToNative.refreshGeofenceZones();
	} else if (webToNativeIos) {
		webToNativeIos.postMessage({ action: "refreshGeofenceZones" } as GeofencingIosMessage);
	}
};

/**
 * Sets (or merges into) the webhook called when a geofence trigger fires.
 * @example
 * wtn.Geofencing.setWebhook({
 *   url: "https://example.com/geofence",
 *   headers: { Authorization: "Bearer token" },
 *   callback: (res) => console.log(res),
 * });
 */
export const setWebhook = (options: GeofenceWebhookOptions): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;

	const { url, headers, userContext, callback } = options || ({} as GeofenceWebhookOptions);

	registerCb(
		(response: GeofencingResponse) => {
			const { type } = response;
			if (type === "setGeofenceWebhook") {
				callback && callback(response);
			}
		},
		{ key: "setGeofenceWebhook" }
	);

	if (platform === "ANDROID_APP") {
		webToNative.setGeofenceWebhook &&
			webToNative.setGeofenceWebhook(JSON.stringify({ url, headers, userContext }));
	} else if (webToNativeIos) {
		webToNativeIos.postMessage({
			action: "setGeofenceWebhook",
			url,
			headers,
		} as GeofencingIosMessage);
	}
};

/**
 * Clears the webhook config set from the JS bridge.
 * @example
 * wtn.Geofencing.removeWebhook({ callback: (res) => console.log(res) });
 */
export const removeWebhook = (options: GeofencingOptions = {}): void => {
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) return;

	const { callback } = options;

	registerCb(
		(response: GeofencingResponse) => {
			const { type } = response;
			if (type === "removeGeofenceWebhook") {
				callback && callback(response);
			}
		},
		{ key: "removeGeofenceWebhook" }
	);

	if (platform === "ANDROID_APP") {
		webToNative.removeGeofenceWebhook && webToNative.removeGeofenceWebhook();
	} else if (webToNativeIos) {
		webToNativeIos.postMessage({ action: "removeGeofenceWebhook" } as GeofencingIosMessage);
	}
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
