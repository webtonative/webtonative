import { BaseCallback, BaseResponse } from "../types";

export interface StripeResponse extends BaseResponse {
	type: "makeTapToPayStripePayment";
	// Additional response properties can be added here based on actual response structure
}

export interface StripeCallback extends BaseCallback {
	(response: StripeResponse): void;
}

export interface StripePaymentData {
	secretToken: string;
	amount: number;
	currency: string;
	isSimulated: boolean;
	captureMethod: string;
	locationId: string;
	connectedAccountId?: string;
	apiUrl?: string;
	client_secret?: string;
}

export interface StripeOptions {
	callback?: StripeCallback;
	apiUrl?: string;
	amount: number;
	currency: string;
	isSimulated?: boolean;
	captureMethod?: string;
	connectionToken: string;
	stripeLocationId: string;
	connectedAccountId?: string;
	clientSecret?: string;
}

export interface StripeIosMessage extends StripePaymentData {
	action: string;
}

export type TapToPaySetupAction =
	| "inspectTapToPaySetup"
	| "presentTapToPayEducation"
	| "prepareTapToPaySetup";

export interface TapToPaySetupResponse extends BaseResponse {
	type: TapToPaySetupAction;
}

export interface TapToPaySetupCallback extends BaseCallback {
	(response: TapToPaySetupResponse): void;
}

export interface TapToPaySetupOptions {
	callback?: TapToPaySetupCallback;
}

export interface PrepareTapToPaySetupOptions extends TapToPaySetupOptions {
	connectionToken: string;
	stripeLocationId: string;
	connectedAccountId?: string;
}

export interface TapToPaySetupIosMessage {
	action: TapToPaySetupAction;
	locationId?: string;
	secretToken?: string;
	connectedAccountId?: string;
}
