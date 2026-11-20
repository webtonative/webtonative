export interface SMSResponse {
	type: string;
	status?: string;
	[key: string]: any;
}

export interface SMSCapabilitiesResponse extends SMSResponse {
	composer?: boolean;
	otpListener?: { consent: boolean; retriever: boolean };
	read?: boolean;
	sendDirect?: boolean;
}

export interface SMSSendParams {
	/** E.164 numbers, e.g. "+919876543210" */
	recipients: string[];
	body?: string;
}

export interface SMSSendResponse extends SMSResponse {
	status?: "OPENED" | "SENT" | "CANCELLED" | "FAILED" | "UNAVAILABLE" | "NOT_ENABLED";
}

export interface SMSStartOTPListenerParams {
	mode?: "consent" | "retriever";
	/** 4–8, default 6 */
	length?: number;
	/** Capture group 1 is the code if present, else the whole match */
	regex?: string;
	/** Max and default 300000 (5 min) */
	timeoutMs?: number;
	/** Consent mode only */
	sender?: string;
}

export interface SMSStartOTPListenerResponse extends SMSResponse {
	status?: "RECEIVED" | "TIMEOUT" | "DENIED" | "CANCELLED" | "FAILED" | "NOT_ENABLED" | "UNSUPPORTED";
	otp?: string | null;
}

export interface SMSReadParams {
	sender?: string;
	/** Epoch ms */
	since?: number;
	/** 1–100, default 20 */
	limit?: number;
}

export interface SMSMessage {
	sender: string;
	body: string;
	/** Epoch ms */
	receivedAt: number;
}

export interface SMSReadResponse extends SMSResponse {
	status?: "SUCCESS" | "FAILED" | "PERMISSION_DENIED" | "NOT_ENABLED" | "UNSUPPORTED";
	messages?: SMSMessage[];
}

export interface SMSSendDirectParams {
	/** E.164 number */
	recipient: string;
	body: string;
}

export interface SMSSendDirectResponse extends SMSResponse {
	status?: "DISPATCHED" | "FAILED" | "PERMISSION_DENIED" | "NOT_ENABLED" | "UNSUPPORTED";
}
