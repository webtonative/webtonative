import {
	webToNative,
	isNativeApp,
	registerForAbMobCb,
	deRegisterForAbMobCb,
	platform,
	webToNativeIos,
} from "../utills";
import { Platform } from "../types";
import {
	AdMobResponse,
	AdMobCallback,
	BannerAdOptions,
	FullScreenAdOptions,
	RewardsAdOptions,
	AdMobIosMessage
} from "./types";

let adMobCb: AdMobCallback | null = null;

/**
 * This function shows banner ad
 * @param options - Banner ad options
 * @example wtn.bannerAd({
 *  adId: "ca-app-pub-xxx"
 * });
 */
const bannerAd = (options: BannerAdOptions = {}): any => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "showBannerAd",
				adId: options.adId || "",
			} as AdMobIosMessage);
		}
		platform === "ANDROID_APP" && webToNative.showBannerAd(JSON.stringify(options));
		return this;
	}
};

/**
 * This function shows full screen ad
 * @param options - Full screen ad options
 * @example wtn.fullScreenAd({
 *  fullScreenAdCallback:(value)=>{
 *    console.log(value);
 *  }
 * });
 */
const fullScreenAd = (options: FullScreenAdOptions = {}): any => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { fullScreenAdCallback } = options;
		registerForAbMobCb((response: AdMobResponse) => {
			const { status } = response;
			adMobCb && adMobCb(response);
			if (status === "adDismissed") {
				adMobCb = null;
			}
			if (["adDismissed", "adLoadError", "adError"].indexOf(status) > -1) {
				deRegisterForAbMobCb();
			}
		});
		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "showFullScreenAd",
				adId: options.adId || "",
			} as AdMobIosMessage);
		}
		platform === "ANDROID_APP" && webToNative.showFullScreenAd(JSON.stringify(options));
		if (typeof fullScreenAdCallback === "function") {
			adMobCb = fullScreenAdCallback;
		}
		return this;
	}
};

/**
 * This function shows rewards ad
 * @param options - Rewards ad options
 * @example wtn.rewardsAd({
 *  rewardsAdCallback:(value)=>{
 *    console.log(value);
 *  }
 * });
 */
const rewardsAd = (options: RewardsAdOptions = {}): any => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { rewardsAdCallback } = options;
		registerForAbMobCb((response: AdMobResponse) => {
			const { status } = response;
			adMobCb && adMobCb(response);
			if (status === "adDismissed") {
				adMobCb = null;
			}
			if (["adDismissed", "adLoadError", "adError"].indexOf(status) > -1) {
				deRegisterForAbMobCb();
			}
		});
		if (platform === "IOS_APP" && webToNativeIos) {
			webToNativeIos.postMessage({
				action: "showRewardAd",
				adId: options.adId || "",
			} as AdMobIosMessage);
		}
		platform === "ANDROID_APP" && webToNative.showRewardsAd(JSON.stringify(options));
		if (typeof rewardsAdCallback === "function") {
			adMobCb = rewardsAdCallback;
		}
		return this;
	}
};

export { bannerAd, fullScreenAd, rewardsAd };