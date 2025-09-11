export interface InAppPurchaseResponse {
	type: string;
	isSuccess?: boolean;
	transactionId?: string;
	status?: string;
	receiptData?: any;
	[key: string]: any;
}

export interface InAppPurchaseCallback {
	(response: InAppPurchaseResponse): void;
}

export interface InAppPurchaseOptions {
	productId: string;
	callback?: InAppPurchaseCallback;
	productType?: string;
	isConsumable?: boolean;
}

export interface GetAllPurchasesOptions {
	callback?: InAppPurchaseCallback;
}

export interface GetReceiptDataOptions {
	callback?: InAppPurchaseCallback;
}

export interface InAppPurchaseIosMessage {
	action: string;
	productId?: string;
}

export interface InAppPurchaseAndroidParams {
	action: string;
	productId?: string;
	productType?: string;
	isConsumable?: boolean;
}
