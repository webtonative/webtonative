import { platform, webToNative, webToNativeIos, registerCb, deRegisterCbByKey } from "../utills";
/**
 *
 *
 */
export const start = (options = {}) => {
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
			(response) => {
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

		platform === "IOS_APP" &&
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
			});

		platform === "ANDROID_APP" &&
			webToNative.startTrackingLocation(JSON.stringify({
				action: "startLocation",
				data,
				interval:timeout,
				callback,
				apiUrl,
				displacement:distanceFilter
			}));
	}
};

/**
 *
 *
 */
export const stop = (options = {}) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		deRegisterCbByKey("LOCATION_UPDATE");

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "stopLocation",
			});

		platform === "ANDROID_APP" &&
			webToNative.stopTrackingLocation();
	}
};
