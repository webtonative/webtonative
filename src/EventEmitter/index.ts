type EventHandler = (data: any) => void;

const listeners: Record<string, EventHandler[]> = {};

export const on = (event: string, handler: EventHandler): void => {
	if (!listeners[event]) {
		listeners[event] = [];
	}
	listeners[event].push(handler);
};

export const off = (event: string, handler: EventHandler): void => {
	if (!listeners[event]) return;
	listeners[event] = listeners[event].filter((h) => h !== handler);
	if (listeners[event].length === 0) {
		delete listeners[event];
	}
};

export const once = (event: string, handler: EventHandler): void => {
	const wrapper: EventHandler = (data: any) => {
		handler(data);
		off(event, wrapper);
	};
	on(event, wrapper);
};

export const emit = (event: string, data?: any): void => {
	if (!listeners[event]) return;
	listeners[event].slice().forEach((handler) => handler(data));
};

// Called by native (Android/iOS) to push events into JS:
//   window.wtnDispatchEvent("share-received", "{...json...}")
if (typeof window !== "undefined") {
	(window as any).wtnDispatchEvent = (eventName: string, dataJson: string | object) => {
		const data = typeof dataJson === "string" ? JSON.parse(dataJson) : dataJson;
		emit(eventName, data);
	};
}
