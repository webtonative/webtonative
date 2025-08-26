import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import { BeaconOptions, BeaconResponse, BeaconIosMessage } from "./types";

/**
 * Initializes beacon data
 * @param options - Options for initializing beacon data
 */
export const initBeaconData = (options: BeaconOptions = {}): void => {
	const { callback, beaconData } = options;
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		registerCb((response: BeaconResponse) => {
			const { type } = response;
			if (type === "initBeaconData") {
				callback && callback(response);
			}
		});

		platform === "ANDROID_APP" &&
        	webToNative.initBeaconData(JSON.stringify(beaconData));

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "initBeaconData",
				data: beaconData
			} as BeaconIosMessage);
		}
	}
};