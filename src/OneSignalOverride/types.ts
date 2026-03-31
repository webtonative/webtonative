export {};

declare global {
	interface Window {
		WTN: any;
		OneSignal: any;
		OneSignalDeferred: any;
		__WTN_OneSignalEvent: (namespace: string, event: string, data: any) => void;
	}
}
