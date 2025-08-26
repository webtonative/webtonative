// Define types for AdMob module

// AdMob response interface
export interface AdMobResponse {
  status: 'adDismissed' | 'adLoadError' | 'adError' | string;
  [key: string]: any;
}

// AdMob callback function type
export type AdMobCallback = (response: AdMobResponse) => void;

// Banner ad options
export interface BannerAdOptions {
  adId?: string;
  [key: string]: any;
}

// Full screen ad options
export interface FullScreenAdOptions {
  adId?: string;
  fullScreenAdCallback?: AdMobCallback;
  [key: string]: any;
}

// Rewards ad options
export interface RewardsAdOptions {
  adId?: string;
  rewardsAdCallback?: AdMobCallback;
  [key: string]: any;
}

// iOS message structure
export interface AdMobIosMessage {
  action: string;
  adId?: string;
  [key: string]: any;
}