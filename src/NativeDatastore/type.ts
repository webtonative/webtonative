export type IKeyName = {
	value?: any;
	keyName?: string;
};

export type IAppDataCB = {
	isSuccess: boolean;
};

export type IAppDataCBWithValue = {
	isSuccess: boolean;
	value?: any;
	keyName?: string;
};

export type ISetAppDataOptions = IKeyName & {
	callback?: (response: IAppDataCBWithValue) => void;
};

export type IGetAppDataOptions = {
	callback?: (response: IAppDataCBWithValue) => void;
	keyName?: string;
};

export type IDeleteAppDataOptions = {
	callback?: (response: IAppDataCB) => void;
	keyName?: string;
};

export type ICloudSyncResponse = {
	type: string;
	[key: string]: any;
};

export type IEnableCloudSyncOptions = {
	/** true to explicitly pick / switch the Google account */
	selectAccount?: boolean;
};

export type IDisableCloudSyncOptions = {
	deleteRemote?: boolean;
};
