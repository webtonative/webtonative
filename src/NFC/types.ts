export interface NFCResponse {
	type: string;
	status?: string;
	[key: string]: any;
}

export interface NFCCallback {
	(response: NFCResponse): void;
}

export interface NFCScanTagOptions {
	message?: string;
	openUrl?:boolean
	continuous?:boolean
	callback?: NFCCallback;
}

export interface NFCOpenUrlOptions {
	openUrl: boolean;
	callback?: NFCCallback;
}

export type NFCTagType = "url" | "string";

export interface NFCWriteTagOptions {
	type: NFCTagType;
	content: string;
	message?:string;
	callback?: NFCCallback;
}

export interface NFCIosMessage {
	action: string;
	message?: string;
	openUrl?: boolean;
	type?: NFCTagType;
	content?: string;
}
