import { BaseResponse } from "../types";
import { platform, registerCb, webToNative, webToNativeIos } from "../utills";

interface IShowMetaBannerAd {
	position?: "TOP" | "BOTTOM";
	placementId?: string;
	callback?: (response: BaseResponse) => void;
}
interface IShowMetaFullscreenAd {
	placementId?: string;
	callback?: (response: BaseResponse) => void;
}

const showMetaBannerAd = (options: IShowMetaBannerAd = {}): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, ...rest } = options || {};

		registerCb((response: BaseResponse) => {
			const { type } = response;
			if (type === "showMetaBannerAd") {
				callback && callback(response);
			}
		});

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "showMetaBannerAd",
				...rest,
			});
		}

		platform === "ANDROID_APP" && webToNative.showMetaBannerAd(JSON.stringify(options));
	}
};

const showMetaFullscreenAd = (options: IShowMetaFullscreenAd = {}): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, ...rest } = options || {};

		registerCb((response: BaseResponse) => {
			const { type } = response;
			if (type === "showMetaFullscreenAd") {
				callback && callback(response);
			}
		});

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "showMetaFullscreenAd",
				...rest,
			});
		}

		platform === "ANDROID_APP" && webToNative.showMetaFullscreenAd(JSON.stringify(options));
	}
};

const showMetaRewardedAd = (options: IShowMetaFullscreenAd = {}): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { callback, ...rest } = options || {};

		registerCb((response: BaseResponse) => {
			const { type } = response;
			if (type === "showMetaRewardedAd") {
				callback && callback(response);
			}
		});

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "showMetaRewardedAd",
				...rest,
			});
		}

		platform === "ANDROID_APP" && webToNative.showMetaRewardedAd(JSON.stringify(options));
	}
};

const setMetaAdsTestMode = (options: { state?: "TRUE" | "FALSE" } = {}): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { state } = options || {};

		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "setMetaAdsTestMode",
				state,
			});
		}

		platform === "ANDROID_APP" && webToNative.setMetaAdsTestMode(JSON.stringify(state));
	}
};

export { showMetaBannerAd, showMetaFullscreenAd, showMetaRewardedAd, setMetaAdsTestMode };
