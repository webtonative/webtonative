// Common types for social login
export interface SocialLoginResponse {
	type: string;
	[key: string]: any;
}

export interface SocialLoginCallback {
	(response: SocialLoginResponse): void;
}

export interface SocialLoginOptions {
	callback?: SocialLoginCallback;
	scope?: string;
}

// Facebook types
export interface FacebookLoginResponse extends SocialLoginResponse {
	type: 'fbLoginToken';
}

export interface FacebookLogoutResponse extends SocialLoginResponse {
	type: 'fbLogOut';
}

export interface FacebookIosMessage {
	action: 'fbSignIn' | 'fbSignOut';
	scope?: string;
}

// Google types
export interface GoogleLoginResponse extends SocialLoginResponse {
	type: 'googleLoginToken';
}

export interface GoogleLogoutResponse extends SocialLoginResponse {
	type: 'googleLogOut';
}

export interface GoogleIosMessage {
	action: 'googleSignIn' | 'googleSignOut';
	scope?: string;
}

// Apple types
export interface AppleLoginResponse extends SocialLoginResponse {
	type: 'appleLoginToken';
}

export interface AppleIosMessage {
	action: 'appleSignIn';
	scope?: string;
}