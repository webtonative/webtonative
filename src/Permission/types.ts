export type PermissionType =
	| 'camera'
	| 'location'
	| 'location_always'
	| 'notification'
	| 'record_audio'
	| 'contact'
	| 'bluetooth'
	| 'speech_recognition';

export type PermissionStatus =
	| 'ALLOWED'
	| 'NOT_ALLOWED'
	| 'PERMANENTLY_BLOCKED'
	| 'RESTRICTED'
	| 'UNKNOWN_STATUS';

export interface PermissionResponse {
	type: string;
	status: PermissionStatus;
}

export interface PermissionOptions {
	permissions?:PermissionType[]
	callback?: (response: PermissionResponse) => void;
}
export interface PermissionOptionsRequest {
	permissions?:PermissionType[]
	callback?: (response: PermissionResponse) => void;
	openAppSetting?: boolean;
	alertDialogStyle?: any;
}
