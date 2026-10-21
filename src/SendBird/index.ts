import { isIosApp, isAndroidApp } from "../index";
import { registerCb, webToNative, webToNativeIos } from "../utills";
import { BaseResponse } from "../types";

type IInitializeSendBird = {
	userId: string;
	callback?: (response: BaseResponse) => void;
	nickname?: string;
	profileurl?: string;
};
export const sendbirdInitialize = (options: IInitializeSendBird) => {
	const { callback, ...rest } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "sendbirdInitialize") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.sendbirdInitialize(JSON.stringify(options));
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "sendbirdInitialize",
			...rest,
		});
	}
};
export const sendbirdIsInitialized = (options?: {
	callback?: (response: BaseResponse & { initialized: boolean; appId: string }) => void;
}) => {
	const { callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "sendbirdIsInitialized") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.sendbirdIsInitialized();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "sendbirdIsInitialized",
		});
	}
};
export const sendbirdIsConnected = (options?: {
	callback?: (response: BaseResponse & { connected: boolean }) => void;
}) => {
	const { callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "sendbirdIsConnected") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.sendbirdIsConnected();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "sendbirdIsConnected",
		});
	}
};
export const sendbirdGetUserId = (options?: {
	callback?: (response: BaseResponse & { userId: string }) => void;
}) => {
	const { callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "sendbirdGetUserId") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.sendbirdGetUserId();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "sendbirdGetUserId",
		});
	}
};

interface ISendbirdUpdateUserInfo {
	callback?: (response: BaseResponse & { success: boolean }) => void;
	nickname?: string;
	profileurl?: string;
}

export const sendbirdUpdateUserInfo = (options?: ISendbirdUpdateUserInfo) => {
	const { callback, ...rest } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "sendbirdUpdateUserInfo") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.sendbirdUpdateUserInfo(JSON.stringify(rest));
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "sendbirdUpdateUserInfo",
			...rest,
		});
	}
};

interface ISendbirdCreateGroupChannel {
	callback?: (response: BaseResponse & { success?: boolean; channelUrl?: string }) => void;
	name?: string;
	userIds?: string[];
	isDistinct?: boolean;
}

export const sendbirdCreateGroupChannel = (options?: ISendbirdCreateGroupChannel) => {
	const { callback, ...rest } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "sendbirdCreateGroupChannel") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.sendbirdCreateGroupChannel(JSON.stringify(rest));
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "sendbirdCreateGroupChannel",
			...rest,
		});
	}
};
export const sendbirdShowUI = (options?: {
	callback?: (response: BaseResponse & { success?: boolean; status?: string }) => void;
}) => {
	const { callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "sendbirdShowUI") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.sendbirdShowUI();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "sendbirdShowUI",
		});
	}
};
export const sendbirdShowChannelUI = (options?: {
	callback?: (
		response: BaseResponse & { success?: boolean; status?: string; channelUrl?: string }
	) => void;
	url?: string;
}) => {
	const { callback, ...rest } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "sendbirdShowChannelUI") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.sendbirdShowChannelUI(JSON.stringify(rest));
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "sendbirdShowChannelUI",
			...rest,
		});
	}
};

export const sendbirdDisconnect = (options?: {
	callback?: (response: BaseResponse & { success?: boolean }) => void;
}) => {
	const { callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "sendbirdDisconnect") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.sendbirdDisconnect();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "sendbirdDisconnect",
		});
	}
};

export const sendbirdLogout = (options?: {
	callback?: (response: BaseResponse & { success?: boolean }) => void;
}) => {
	const { callback } = options || {};

	registerCb((response) => {
		const { type } = response;
		if (type === "sendbirdLogout") {
			callback && callback(response);
		}
	});

	if (isAndroidApp) {
		webToNative.sendbirdLogout();
	} else if (isIosApp && webToNativeIos) {
		webToNativeIos.postMessage({
			action: "sendbirdLogout",
		});
	}
};
