export interface MediaPlayerOptions {
	url?: string;
	imageUrl?: string;
}

export interface MediaPlayerIosMessage {
	action: string;
	url?: string;
	image?: string;
}

export interface MediaPlayerAndroidParams {
	url?: string;
	imageUrl?: string;
}