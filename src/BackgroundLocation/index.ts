import { platform, webToNative, webToNativeIos, registerCb, deRegisterCbByKey } from "../utills";
import { BackgroundLocationOptions, BackgroundLocationIosMessage, LocationUpdateResponse } from "./types";

/**
 * Starts tracking background location
 * @param options - Background location tracking options
 */
export const start = (options: BackgroundLocationOptions = {}): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const {
			data,
			callback,
			backgroundIndicator = false,
			pauseAutomatically = true,
			distanceFilter = 0.0,
			desiredAccuracy = "best",
			activityType = "other",
			apiUrl,
			timeout,
		} = options;

		registerCb(
			(response: LocationUpdateResponse) => {
				const { type } = response;
				if (type === "LOCATION_UPDATE") {
					callback && callback(response);
				}
			},
			{
				key: "LOCATION_UPDATE",
				ignoreDelete: true,
			}
		);

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "startLocation",
				data,
				backgroundIndicator,
				pauseAutomatically,
				distanceFilter,
				desiredAccuracy,
				activityType,
				apiUrl,
				timeout,
			} as BackgroundLocationIosMessage);
		}

		platform === "ANDROID_APP" &&
			webToNative.startTrackingLocation(JSON.stringify({
				action: "startLocation",
				data,
				interval: timeout,
				callback,
				apiUrl,
				displacement: distanceFilter
			}));
	}
};

/**
 * Stops tracking background location
 * @param options - Options for stopping location tracking
 */
export const stop = (options: Record<string, any> = {}): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		deRegisterCbByKey("LOCATION_UPDATE");

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "stopLocation",
			} as BackgroundLocationIosMessage);
		}

		platform === "ANDROID_APP" &&
			webToNative.stopTrackingLocation();
	}
};