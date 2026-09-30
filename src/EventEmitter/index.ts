type EventHandler = (data: any) => void;

interface ListenerEntry {
	handler: EventHandler;
	callable: EventHandler;
	namespace: string;
}

interface EventOptions {
	events: string;
	callback?: EventHandler;
}

type EventInput = string | EventOptions;

const listeners: Record<string, ListenerEntry[]> = {};

function normalize(input: EventInput, handler?: EventHandler): { events: string; handler?: EventHandler } {
	return typeof input === "string"
		? { events: input, handler }
		: { events: input.events, handler: input.callback ?? handler };
}

function parseEvent(event: string): { name: string; namespace: string } {
	const dot = event.indexOf(".");
	return dot === -1
		? { name: event, namespace: "" }
		: { name: event.slice(0, dot), namespace: event.slice(dot + 1) };
}

function eachEvent(events: string, fn: (name: string, namespace: string) => void): void {
	events
		.trim()
		.split(/\s+/)
		.forEach((e) => {
			const { name, namespace } = parseEvent(e);
			fn(name, namespace);
		});
}

export const on = (input: EventInput, callback?: EventHandler): void => {
	const { events, handler } = normalize(input, callback);
	if (!handler) return;
	eachEvent(events, (name, namespace) => {
		if (!listeners[name]) listeners[name] = [];
		listeners[name].push({ handler: handler!, callable: handler!, namespace });
	});
	console.log({ listeners });
};

export const off = (input: EventInput, callback?: EventHandler): void => {
	const { events, handler } = normalize(input, callback);
	eachEvent(events, (name, namespace) => {
		if (!name) {
			Object.keys(listeners).forEach((key) => {
				listeners[key] = listeners[key].filter(
					(e) => !(e.namespace === namespace && (!handler || e.handler === handler))
				);
				if (!listeners[key].length) delete listeners[key];
			});
			return;
		}

		if (!listeners[name]) return;

		listeners[name] = listeners[name].filter((e) => {
			if (namespace && e.namespace !== namespace) return true;
			if (handler && e.handler !== handler) return true;
			return false;
		});

		if (!listeners[name].length) delete listeners[name];
	});
};

export const once = (input: EventInput, callback?: EventHandler): void => {
	const { events, handler } = normalize(input, callback);
	if (!handler) return;
	eachEvent(events, (name, namespace) => {
		const callable: EventHandler = (data: any) => {
			handler!(data);
			if (listeners[name]) {
				listeners[name] = listeners[name].filter((e) => e.callable !== callable);
				if (!listeners[name].length) delete listeners[name];
			}
		};
		if (!listeners[name]) listeners[name] = [];
		listeners[name].push({ handler: handler!, callable, namespace });
	});
};

export const emit = (event: string, data?: any): void => {
	console.log({ event, data, listeners });
	const { name } = parseEvent(event);
	if (listeners[name]) {
		listeners[name].slice().forEach((e) => e.callable({ type: name, data: data }));
	}
	if (listeners["*"]) {
		listeners["*"].slice().forEach((e) => e.callable({ type: name, data: data }));
	}
};

export const WTN = { on, off, once, emit };

export const wtnDispatchEvent = (eventJson: string | { type: string; data: any }): void => {
	const event = typeof eventJson === "string" ? JSON.parse(eventJson) : eventJson;
	emit(event.type, event.data);
};

if (typeof window !== "undefined") {
	(window as any).WTN = WTN;
	// Called by native (Android/iOS) to push events into JS
	(window as any).nativeEventCB = wtnDispatchEvent;
}
