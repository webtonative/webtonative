import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
/**
 *
 *
 */
export const initBeaconData = (options = {}) => {
	const { callback, beaconData } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response) => {
			const { type } = response;
			if (type === "initBeaconData") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
        	webToNative.initBeaconData(JSON.stringify(beaconData));

		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "initBeaconData",
				data:beaconData
			});
	}
};