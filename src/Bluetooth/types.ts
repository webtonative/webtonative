export interface BluetoothResponse {
	type: string;
	status?: string;
	devices?: BluetoothDevice[];
	[key: string]: any;
}

export interface BluetoothDevice {
	name?: string;
	address?: string;
	[key: string]: any;
}

export interface BluetoothCallback {
	(response: BluetoothResponse): void;
}

export interface BluetoothScanOptions {
	callback?: BluetoothCallback;
}

export interface BluetoothPairOptions {
	callback?: BluetoothCallback;
	address?: string;
	timeout?: number;
}

export interface BluetoothUnpairOptions {
	callback?: BluetoothCallback;
	address?: string;
}

export interface BluetoothPairParams {
	address?: string;
	timeout?: number;
}

export interface BluetoothUnpairParams {
	address?: string;
}