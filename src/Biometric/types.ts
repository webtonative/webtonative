export interface BiometricResponse {
	type: string;
	status?: string;
	[key: string]: any;
}

export interface BiometricCallback {
	(response: BiometricResponse): void;
}

export interface BiometricOptions {
	callback?: BiometricCallback;
	secret?: string;
	prompt?: string;
	isAuthenticationOptional?: boolean;
}

export interface BiometricIosMessage {
	action: string;
	secret?: string;
	prompt?: string;
}

export interface BiometricAuthOptions {
	prompt?: string;
	isAuthenticationOptional?: boolean;
}