type EventHandler = (data: any) => void;

interface ListenerEntry {
	handler: EventHandler;   // original, used for off() matching
	callable: EventHandler;  // actual invoked fn (wrapped for once())
	namespace: string;
}

const listeners: Record<string, ListenerEntry[]> = {};

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

// on("event", handler)
// on("event.namespace", handler)
// on("event1 event2", handler)
export const on = (events: string, handler: EventHandler): void => {
	eachEvent(events, (name, namespace) => {
		if (!listeners[name]) listeners[name] = [];
		listeners[name].push({ handler, callable: handler, namespace });
	});
};

// off("event")               — remove all handlers for event
// off("event", handler)      — remove specific handler
// off("event.namespace")     — remove all handlers in namespace for event
// off(".namespace")          — remove all handlers in namespace across all events
// off("event1 event2")       — remove across multiple events
export const off = (events: string, handler?: EventHandler): void => {
	eachEvent(events, (name, namespace) => {
		if (!name) {
			// namespace-only: ".ns" → remove across everything
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

// once("event", handler)
// once("event.namespace", handler)
// once("event1 event2", handler)
export const once = (events: string, handler: EventHandler): void => {
	eachEvent(events, (name, namespace) => {
		const callable: EventHandler = (data: any) => {
			handler(data);
			if (listeners[name]) {
				listeners[name] = listeners[name].filter((e) => e.callable !== callable);
				if (!listeners[name].length) delete listeners[name];
			}
		};
		if (!listeners[name]) listeners[name] = [];
		listeners[name].push({ handler, callable, namespace });
	});
};

export const emit = (event: string, data?: any): void => {
	const { name } = parseEvent(event);
	if (!listeners[name]) return;
	listeners[name].slice().forEach((e) => e.callable(data));
};

// Called by native (Android/iOS) to push events into JS:
//   window.wtnDispatchEvent("share-received", "{...json...}")
if (typeof window !== "undefined") {
	(window as any).wtnDispatchEvent = (eventName: string, dataJson: string | object) => {
		const data = typeof dataJson === "string" ? JSON.parse(dataJson) : dataJson;
		emit(eventName, data);
	};
}
