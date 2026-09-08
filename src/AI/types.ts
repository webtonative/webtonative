/** Where the image handed to the model comes from. */
export type AIImageMode = "camera" | "gallery" | "base64";

export type AISchemaFieldType = "string" | "number" | "boolean" | "array" | "object";

/**
 * One field to pull out of the image. The description is what the model reads to
 * decide what belongs in the field, so it is worth writing as an instruction.
 */
export interface AISchemaField {
	type: AISchemaFieldType;
	description?: string;
	/** Restricts the answer to a fixed set of values. */
	enum?: (string | number)[];
	/** Shape of each entry, when type is "array". */
	items?: AISchemaField;
	/** Nested fields, when type is "object". */
	properties?: AISchema;
	/** Which nested fields must come back, when type is "object". */
	required?: string[];
}

export interface AISchema {
	[field: string]: AISchemaField;
}

/** Copy for the native capture screen. Only used when mode is "camera" or "gallery". */
export interface AIUiOptions {
	title?: string;
	overlayHint?: string;
	[key: string]: any;
}

export interface AIResponse {
	type: string;
	isSuccess?: boolean;
	/** The extracted fields, keyed by the schema field names. */
	data?: Record<string, any>;
	error?: string;
	[key: string]: any;
}

export interface AICallback {
	(response: AIResponse): void;
}

export interface AIExtractDataFromImageOptions {
	/** Defaults to "camera". */
	mode?: AIImageMode;
	/** Base64 encoded image. Required when mode is "base64", ignored otherwise. */
	imageString?: string;
	schema: AISchema;
	uiOptions?: AIUiOptions;
	callback?: AICallback;
}

export interface AIIosMessage {
	action: string;
	mode?: AIImageMode;
	imageString?: string;
	schema?: AISchema;
	uiOptions?: AIUiOptions;
}
