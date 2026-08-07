import { platform, registerCb, webToNative } from "../utills";
import {
	SmartTvResponse,
	IsSupportedOptions,
	WatchNextUpsertOptions,
	WatchNextRemoveOptions,
	WatchNextClearOptions,
	ChannelPublishOptions,
	ChannelRemoveOptions,
} from "./types";

/**
 * Checks whether Smart TV features (Watch Next / Channels) are supported on this device
 * @param options - Options containing an optional callback
 */
export const isSupported = (options: IsSupportedOptions = {}): void => {
		const { callback } = options||{};
		registerCb(
			(response: SmartTvResponse) => {
				const { type } = response;
				if (type === "smartTvIsSupported") {
					callback && callback(response);
				}
			},
			{ key: "smartTvIsSupported" }
		);
	if (platform === "ANDROID_APP") {
		webToNative.smartTvIsSupported && webToNative.smartTvIsSupported();
	}
};

/**
 * Adds or updates an item in the Watch Next row
 * @param options - Watch Next item fields plus an optional callback
 */
export const watchNextUpsert = (options: WatchNextUpsertOptions): void => {
	const { callback, ...payload } = options || ({} as WatchNextUpsertOptions);
			registerCb(
			(response: SmartTvResponse) => {
				const { type } = response;
				if (type === "smartTvWatchNextUpsert") {
					callback && callback(response);
				}
			},
			{ key: "smartTvWatchNextUpsert" }
		);
	if (platform === "ANDROID_APP") {
		webToNative.smartTvWatchNextUpsert &&
			webToNative.smartTvWatchNextUpsert(JSON.stringify(payload));
	}
};

/**
 * Removes an item from the Watch Next row
 * @param options - Contains the contentId to remove and an optional callback
 */
export const watchNextRemove = (options: WatchNextRemoveOptions): void => {
	const { contentId, callback } = options || ({} as WatchNextRemoveOptions);
		registerCb(
			(response: SmartTvResponse) => {
				const { type } = response;
				if (type === "smartTvWatchNextRemove") {
					callback && callback(response);
				}
			},
			{ key: "smartTvWatchNextRemove" }
		);
	if (platform === "ANDROID_APP") {
	
		webToNative.smartTvWatchNextRemove && webToNative.smartTvWatchNextRemove(contentId);
	}
};

/**
 * Clears the entire Watch Next row
 * @param options - Options containing an optional callback
 */
export const watchNextClear = (options: WatchNextClearOptions = {}): void => {
	const { callback } = options;
	if (platform === "ANDROID_APP") {
		registerCb(
			(response: SmartTvResponse) => {
				const { type } = response;
				if (type === "smartTvWatchNextClear") {
					callback && callback(response);
				}
			},
			{ key: "smartTvWatchNextClear" }
		);

		webToNative.smartTvWatchNextClear && webToNative.smartTvWatchNextClear();
	}
};

/**
 * Publishes (creates or updates) a home screen channel with its programs
 * @param options - Channel fields plus an optional callback
 */
export const channelPublish = (options: ChannelPublishOptions): void => {
	const { callback, ...payload } = options || ({} as ChannelPublishOptions);
	if (platform === "ANDROID_APP") {
		registerCb(
			(response: SmartTvResponse) => {
				const { type } = response;
				if (type === "smartTvChannelPublish") {
					callback && callback(response);
				}
			},
			{ key: "smartTvChannelPublish" }
		);

		webToNative.smartTvChannelPublish &&
			webToNative.smartTvChannelPublish(JSON.stringify(payload));
	}
};

/**
 * Removes a previously published home screen channel
 * @param options - Contains the channelId to remove and an optional callback
 */
export const channelRemove = (options: ChannelRemoveOptions): void => {
	const { channelId, callback } = options || ({} as ChannelRemoveOptions);
	if (platform === "ANDROID_APP") {
		registerCb(
			(response: SmartTvResponse) => {
				const { type } = response;
				if (type === "smartTvChannelRemove") {
					callback && callback(response);
				}
			},
			{ key: "smartTvChannelRemove" }
		);

		webToNative.smartTvChannelRemove && webToNative.smartTvChannelRemove(channelId);
	}
};

export default {
	isSupported,
	watchNextUpsert,
	watchNextRemove,
	watchNextClear,
	channelPublish,
	channelRemove,
};
