export interface WalletResponse {
	type: string;
	isSuccess?: boolean;
	[key: string]: any;
}

export interface WalletCallback {
	(response: WalletResponse): void;
}

export interface WalletSupportedOptions {
	callback?: WalletCallback;
}

export interface WalletNameOptions {
	callback?: WalletCallback;
}

export interface WalletAddPassesOptions {
	/** Base64 encoded passes (iOS) */
	base64s?: string[];
	/** Remote pass urls (iOS) */
	urls?: string[];
	/** Passes as base64 or url (Android). Falls back to urls + base64s when not given. */
	passes?: string[];
	callback?: WalletCallback;
}

export interface WalletAddPassesConfig {
	base64s?: string[];
	urls?: string[];
}

export interface WalletIosMessage {
	action: string;
	config?: WalletAddPassesConfig;
}

export interface WalletAndroidParams {
	config: {
		passes: string[];
	};
}
