export interface HapticsOptions {
	effect?: string;
    soundName?: string
}

export interface HapticsIosMessage {
	action: string;
	effect?: string;
}