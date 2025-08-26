export interface ContactsResponse {
	type: string;
	[key: string]: any;
}

export interface ContactsCallback {
	(response: ContactsResponse): void;
}

export interface ContactsOptions {
	callback?: ContactsCallback;
}

export interface ContactsIosMessage {
	action: string;
}