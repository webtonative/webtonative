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

/**
 * How a pass is addressed. Which fields apply depends on the call: passes already in
 * the wallet are found by passTypeIdentifier + serialNumber (or passType for a whole
 * group), while a pass you hold is given as base64 or url.
 */
export interface WalletPass {
	/** Matches every pass of this type */
	passType?: string;
	/** Paired with serialNumber to address a single pass */
	passTypeIdentifier?: string;
	serialNumber?: string;
	/** Base64 encoded pass */
	base64?: string;
	/** Remote pass url */
	url?: string;
}

export interface WalletIosMessage {
	action: string;
	config?: WalletAddPassesConfig;
	pass?: WalletPass;
}

export interface WalletGetPassesOptions {
	/** Returns every pass of this type */
	passType?: string;
	/** With serialNumber, returns just that one pass */
	passTypeIdentifier?: string;
	serialNumber?: string;
	callback?: WalletCallback;
}

/** Shared by checkPassExists and removePass — identify the pass, or supply it. */
export interface WalletPassRefOptions {
	passTypeIdentifier?: string;
	serialNumber?: string;
	base64?: string;
	url?: string;
	callback?: WalletCallback;
}

export interface WalletReplacePassOptions {
	base64?: string;
	url?: string;
	callback?: WalletCallback;
}

export interface WalletAndroidParams {
	config: {
		passes: string[];
	};
}
