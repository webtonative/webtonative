import { webToNative, isNativeApp, registerForAbMobCb, deRegisterForAbMobCb, platform } from "../utills";
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
export default bannerAd = (options = {}) => {
  isNativeApp && webToNative.showBannerAd(JSON.stringify(options));
  return this;
};

export default fullScreenAd = (options = {}) => {
	if(platform == "ANDROID_APP"){
		const { fullScreenAdCallback } = options;
		registerForAbMobCb((response) => {
			const { status } = response;
			adMobCb && adMobCb(response);
			if (status === "adDismissed") {
				adMobCb = null;
			}
			if(["adDismissed","adLoadError","adError"].indexOf(status) > -1){
				deRegisterForAbMobCb();
			}
	 	});
	  	isNativeApp && webToNative.showFullScreenAd(JSON.stringify(options));
	  	if (typeof fullScreenAdCallback === "function") {
			adMobCb = fullScreenAdCallback;
	  	}
	  	return this;
	}
};

export default rewardsAd = (options = {}) => {
	if(platform == "ANDROID_APP"){
		const { rewardsAdCallback } = options;
		registerForAbMobCb((response) => {
			const { status } = response;
			adMobCb && adMobCb(response);
			if (status === "adDismissed") {
				adMobCb = null;
			}
			if(["adDismissed","adLoadError","adError"].indexOf(status) > -1){
				deRegisterForAbMobCb();
			}
		});
		isNativeApp && webToNative.showRewardsAd(JSON.stringify(options));
		if (typeof rewardsAdCallback === "function") {
			adMobCb = rewardsAdCallback;
		}
		return this;
	}
};