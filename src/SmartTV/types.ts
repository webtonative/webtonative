export interface SmartTvResponse {
	type: string;
	[key: string]: any;
}

export interface SmartTvCallback {
	(response: SmartTvResponse): void;
}

export interface IsSupportedOptions {
	callback?: (response: SmartTvResponse & { isSupported?: boolean }) => void;
}

export interface WatchNextUpsertPayload {
	contentId: string;
	title?: string;
	description?: string;
	playbackUri?: string;
	posterArtUri?: string;
	durationMs?: number;
	lastPlaybackPositionMs?: number;
}

export interface WatchNextUpsertOptions extends WatchNextUpsertPayload {
	callback?: SmartTvCallback;
}

export interface WatchNextRemoveOptions {
	contentId: string;
	callback?: SmartTvCallback;
}

export interface WatchNextClearOptions {
	callback?: SmartTvCallback;
}

export interface ChannelProgram {
	programId: string;
	title?: string;
	description?: string;
	playbackUri?: string;
	posterArtUri?: string;
}

export interface ChannelPublishPayload {
	channelId: string;
	name?: string;
	logoUri?: string;
	programs?: ChannelProgram[];
}

export interface ChannelPublishOptions extends ChannelPublishPayload {
	callback?: SmartTvCallback;
}

export interface ChannelRemoveOptions {
	channelId: string;
	callback?: SmartTvCallback;
}
