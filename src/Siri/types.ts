export interface SiriOptions {
	actionUrl?: string;
	suggestedPhrase?: string;
	title?: string;
}

export interface SiriIosMessage {
	action: string;
	data?: {
		actionUrl?: string;
		suggestedPhrase?: string;
		title?: string;
	};
}