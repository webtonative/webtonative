/**
 * Health data types supported by the HealthBridge plugin.
 * Backed by Health Connect on Android and HealthKit on iOS.
 */
export type HealthDataType =
	| "steps"
	| "distance"
	| "activeEnergy"
	| "totalEnergy"
	| "floorsClimbed"
	| "exerciseTime"
	| "height"
	| "weight"
	| "bodyFat"
	| "leanBodyMass"
	| "heartRate"
	| "restingHeartRate"
	| "hrv"
	| "bloodPressure"
	| "bloodGlucose"
	| "oxygenSaturation"
	| "bodyTemperature"
	| "respiratoryRate"
	| "vo2Max"
	| "sleep"
	| "waterIntake"
	| "calorieIntake"
	| "menstruation";

export interface HealthBridgeResponse {
	type: string;
	[key: string]: any;
}

export interface HealthBridgeCallback {
	(response: HealthBridgeResponse): void;
}

export interface HealthBridgeOptions {
	callback?: HealthBridgeCallback;
}

export interface HealthBridgeReadOptions {
	dataTypes: HealthDataType[];
	startDate: string;
	endDate: string;
	/** Android only — maximum number of records returned per data type. */
	limit?: number;
	/** iOS only — token from a previous read response used to fetch the next page. */
	pageToken?: string;
	callback?: HealthBridgeCallback;
}

export interface HealthRecord {
	dataType: HealthDataType;
	value: number;
	/** ISO 8601 start of the record. `startDate` is accepted as an alias. */
	start?: string;
	/** ISO 8601 end of the record. `endDate` is accepted as an alias. */
	end?: string;
	startDate?: string;
	endDate?: string;
	/** Unit of `value` — required on iOS, ignored on Android. */
	unit?: string;
}

export interface HealthBridgeWriteOptions {
	records: HealthRecord[];
	callback?: HealthBridgeCallback;
}

export interface HealthBridgeDeleteOptions {
	dataType: HealthDataType;
	recordIds: string[];
	callback?: HealthBridgeCallback;
}

export interface HealthBridgeIosMessage {
	action: string;
	dataType?: HealthDataType;
	dataTypes?: HealthDataType[];
	startDate?: string;
	endDate?: string;
	pageToken?: string;
	value?: number;
	unit?: string;
	recordIds?: string[];
}
