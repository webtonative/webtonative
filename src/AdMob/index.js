import {
	webToNative,
	isNativeApp,
	registerForAbMobCb,
	deRegisterForAbMobCb,
	platform,
	webToNativeIos,
} from "../utills";
let adMobCb = null;
/**
 * This function opens native voice search
 * @param {object} options
 * @example wtn.FullScreenAd({
 *  fullScreenAdCallback:(value)=>{
 *    console.log(value);
 *  }
 * });
 */
const bannerAd = (options = {}) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "showBannerAd",
				adId: options.adId || "",
			});
		platform === "ANDROID_APP" && webToNative.showBannerAd(JSON.stringify(options));
		return this;
	}
};

const fullScreenAd = (options = {}) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { fullScreenAdCallback } = options;
		registerForAbMobCb((response) => {
			const { status } = response;
			adMobCb && adMobCb(response);
			if (status === "adDismissed") {
				adMobCb = null;
			}
			if (["adDismissed", "adLoadError", "adError"].indexOf(status) > -1) {
				deRegisterForAbMobCb();
			}
		});
		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "showFullScreenAd",
				adId: options.adId || "",
			});
		platform === "ANDROID_APP" && webToNative.showFullScreenAd(JSON.stringify(options));
		if (typeof fullScreenAdCallback === "function") {
			adMobCb = fullScreenAdCallback;
		}
		return this;
	}
};

const rewardsAd = (options = {}) => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const { rewardsAdCallback } = options;
		registerForAbMobCb((response) => {
			const { status } = response;
			adMobCb && adMobCb(response);
			if (status === "adDismissed") {
				adMobCb = null;
			}
			if (["adDismissed", "adLoadError", "adError"].indexOf(status) > -1) {
				deRegisterForAbMobCb();
			}
		});
		platform === "IOS_APP" &&
			webToNativeIos.postMessage({
				action: "showRewardAd",
				adId: options.adId || "",
			});
		platform === "ANDROID_APP" && webToNative.showRewardsAd(JSON.stringify(options));
		if (typeof rewardsAdCallback === "function") {
			adMobCb = rewardsAdCallback;
		}
		return this;
	}
};

export { bannerAd, fullScreenAd, rewardsAd };
