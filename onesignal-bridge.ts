import * as OneSignal from "./src/OneSignal";
import * as OneSignalExtended from "./src/OneSignal/extended";
import * as Firebase from "./src/Firebase";
import { initOneSignalOverride } from "./src/OneSignalOverride";

declare global {
	interface Window {
		WTN: any;
	}
}

if (typeof window !== "undefined") {
	// If full webtonative.min.js is already loaded, reuse its WTN object.
	// Otherwise create a minimal one with just what the override needs.
	if (!window.WTN) {
		window.WTN = {};
	}

	window.WTN.OneSignal = { ...OneSignal, ...OneSignalExtended };
	window.WTN.Firebase = Firebase;

	initOneSignalOverride();
}
