import "./types";

const PREFIX = "[WTN-OneSignal-Override]";
const log = (msg: string) => console.log(`${PREFIX} ${msg}`);
const warn = (msg: string) => console.warn(`${PREFIX} ${msg}`);

// ─── Event emitter ────────────────────────────────────────────────────────────

const listeners: Record<string, Record<string, Function[]>> = {};

console.log("curr listeners",listeners)

function on(namespace: string, event: string, fn: Function): void {
	if (!listeners[namespace]) listeners[namespace] = {};
	if (!listeners[namespace][event]) listeners[namespace][event] = [];
	listeners[namespace][event].push(fn);
}

function off(namespace: string, event: string, fn: Function): void {
	if (!listeners[namespace]?.[event]) return;
	listeners[namespace][event] = listeners[namespace][event].filter((f) => f !== fn);
}

function emit(namespace: string, event: string, data: any): void {
	listeners[namespace]?.[event]?.forEach((fn) => {
		try {
			fn(data);
		} catch (e) {
			console.error(PREFIX, e);
		}
	});
}

// ─── Proxy factory ────────────────────────────────────────────────────────────
// Unknown properties (future OneSignal API changes) return a safe no-op Promise
// instead of throwing, plus a console.warn so developers notice.

function makeProxy(target: Record<string, any>, path: string): any {
	return new Proxy(target, {
		get(t, prop: string) {
			if (prop in t) return t[prop];
			warn(`OneSignal.${path ? path + "." : ""}${prop} is not implemented in WTN override — returning no-op`);
			return () => Promise.resolve();
		},
	});
}

// ─── FCM token helper ─────────────────────────────────────────────────────────
// Wraps the callback-based WTN.Firebase.Messaging.getFCMToken into a Promise.

function getFCMTokenAsPromise(): Promise<string> {
	return new Promise((resolve, reject) => {
		window.WTN.Firebase.Messaging.getFCMToken({
			callback: (response: any) => {
				if (response && response.token) {
					resolve(response.token);
				} else {
					reject(new Error("WTN: Failed to get FCM token"));
				}
			},
		});
	});
}

// ─── Main init ────────────────────────────────────────────────────────────────

export function initOneSignalOverride(): void {
	console.log("window.WTN?.isNativeApp",window.WTN?.isNativeApp)

	if (typeof window === "undefined" || !window.WTN?.isNativeApp) return;

	const wtn = window.WTN;

	// Global hook called by the native side to fire JS event listeners
	window.__WTN_OneSignalEvent = function (namespace: string, event: string, data: any): void {
		emit(namespace, event, data);
	};

	// ── User.PushSubscription ──────────────────────────────────────────────────

	const PushSubscription = makeProxy(
		{
			optIn: () => {
				log("User.PushSubscription.optIn() → WTN.OneSignal.optInUser");
				wtn.OneSignal.optInUser();
				return Promise.resolve();
			},
			optOut: () => {
				log("User.PushSubscription.optOut() → WTN.OneSignal.optOutUser");
				wtn.OneSignal.optOutUser();
				return Promise.resolve();
			},
			get id() {
				return wtn.OneSignal.getPlayerId();
			},
			get token() {
				return getFCMTokenAsPromise();
			},
			addEventListener: (event: string, fn: Function) => on("User.PushSubscription", event, fn),
			removeEventListener: (event: string, fn: Function) => off("User.PushSubscription", event, fn),
		},
		"User.PushSubscription"
	);

	// ── User ───────────────────────────────────────────────────────────────────

	const User = makeProxy(
		{
			PushSubscription,
			addTag: (key: string, value: any) => {
				log(`User.addTag("${key}") → WTN.OneSignal.setTags`);
				return wtn.OneSignal.setTags({ tags: { [key]: value } });
			},
			addTags: (tags: Record<string, any>) => {
				log("User.addTags() → WTN.OneSignal.setTags");
				return wtn.OneSignal.setTags({ tags });
			},
			removeTag: (key: string) => {
				log(`User.removeTag("${key}") → WTN.OneSignal.setTags (empty value)`);
				return wtn.OneSignal.setTags({ tags: { [key]: "" } });
			},
			removeTags: (keys: string[]) => {
				log("User.removeTags() → WTN.OneSignal.setTags (empty values)");
				return wtn.OneSignal.setTags({ tags: Object.fromEntries(keys.map((k) => [k, ""])) });
			},
			addEmail: (email: string) => {
				log(`User.addEmail("${email}") → WTN.OneSignal.setEmail`);
				return wtn.OneSignal.setEmail({ emailId: email });
			},
			removeEmail: (email: string) => {
				log(`User.removeEmail("${email}") → WTN.OneSignal.logoutEmail`);
				return wtn.OneSignal.logoutEmail({ emailId: email });
			},
			addSms: (number: string) => {
				log(`User.addSms("${number}") → WTN.OneSignal.setSMSNumber`);
				return wtn.OneSignal.setSMSNumber({ smsNumber: number });
			},
			removeSms: (number: string) => {
				log(`User.removeSms("${number}") → WTN.OneSignal.logoutSMSNumber`);
				return wtn.OneSignal.logoutSMSNumber({ smsNumber: number });
			},
			addTrigger: (key: string, value: any) => {
				log(`User.addTrigger("${key}") → WTN.OneSignal.addTrigger`);
				return wtn.OneSignal.addTrigger({ key, value });
			},
			addTriggers: (triggers: Record<string, any>) => {
				log("User.addTriggers() → WTN.OneSignal.addTriggers");
				return wtn.OneSignal.addTriggers({ triggers });
			},
			removeTrigger: (key: string) => {
				log(`User.removeTrigger("${key}") → WTN.OneSignal.removeTrigger`);
				return wtn.OneSignal.removeTrigger({ key });
			},
			removeTriggers: (keys: string[]) => {
				log("User.removeTriggers() → WTN.OneSignal.removeTriggers");
				return wtn.OneSignal.removeTriggers({ keys });
			},
		},
		"User"
	);

	// ── Notifications ─────────────────────────────────────────────────────────

	const Notifications = makeProxy(
		{
			requestPermission: () => {
				log("Notifications.requestPermission() → WTN.OneSignal.requestPermission");
				return wtn.registerNotification();
			},
			get permission() {
				return wtn.checkPermission();
			},
			addEventListener: (event: string, fn: Function) => on("Notifications", event, fn),
			removeEventListener: (event: string, fn: Function) => off("Notifications", event, fn),
		},
		"Notifications"
	);

	// ── Slidedown ─────────────────────────────────────────────────────────────
	// Native apps don't show web slidedown prompts — no-op with a warning.

	const Slidedown = makeProxy(
		{
			promptPush: () => { warn("Slidedown.promptPush() → no-op in native app"); return Promise.resolve(); },
			promptPushCategories: () => { warn("Slidedown.promptPushCategories() → no-op"); return Promise.resolve(); },
			promptSms: () => { warn("Slidedown.promptSms() → no-op"); return Promise.resolve(); },
			promptEmail: () => { warn("Slidedown.promptEmail() → no-op"); return Promise.resolve(); },
			promptSmsAndEmail: () => { warn("Slidedown.promptSmsAndEmail() → no-op"); return Promise.resolve(); },
		},
		"Slidedown"
	);

	// ── Debug ─────────────────────────────────────────────────────────────────

	const Debug = makeProxy({ setLogLevel: (_level: any) => { /* no-op */ } }, "Debug");

	// ── Root shim ─────────────────────────────────────────────────────────────

	const shimOneSignal = new Proxy(
		{
			init: (options: any) => {
				log(`init(appId: ${options?.appId}) → no-op (native SDK pre-configured)`);
				return Promise.resolve();
			},
			login: (externalId: string) => {
				log(`login("${externalId}") → WTN.OneSignal.setExternalUserId`);
				return wtn.OneSignal.setExternalUserId(externalId);
			},
			logout: () => {
				log("logout() → WTN.OneSignal.removeExternalUserId");
				return wtn.OneSignal.removeExternalUserId();
			},
			User,
			Notifications,
			Slidedown,
			Debug,
		},
		{
			get(target: any, prop: string) {
				if (prop in target) return target[prop];
				warn(`OneSignal.${prop} is not implemented in WTN override — returning no-op`);
				return () => Promise.resolve();
			},
		}
	);

	// ── Intercept OneSignalDeferred ───────────────────────────────────────────

	const existingQueue: Function[] = Array.isArray(window.OneSignalDeferred)
		? window.OneSignalDeferred
		: [];

	// Replace array with object whose .push() runs callbacks immediately.
	// Locked via defineProperty so the real SDK cannot reclaim this namespace.
	const deferredShim = {
		push: (fn: Function) => {
			try {
				fn(shimOneSignal);
			} catch (e) {
				console.error(PREFIX, e);
			}
		},
	};
	Object.defineProperty(window, "OneSignalDeferred", {
		get: () => deferredShim,
		set: () => { /* intentionally blocked */ },
		configurable: false,
	});

	// Drain any callbacks that were queued before our script loaded
	existingQueue.forEach((fn) => {
		if (typeof fn === "function") fn(shimOneSignal);
	});

	// ── Claim window.OneSignal ────────────────────────────────────────────────
	// Use Object.defineProperty so the real OneSignal SDK cannot overwrite our
	// shim when it loads — it checks window.OneSignal, sees it's set, and backs off.

	Object.defineProperty(window, "OneSignal", {
		get: () => shimOneSignal,
		set: () => { /* intentionally blocked */ },
		configurable: false,
	});

	log("Override active — all OneSignal calls routed through WTN native bridge");
}
