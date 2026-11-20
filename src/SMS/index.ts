import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import {
	SMSCapabilitiesResponse,
	SMSReadParams,
	SMSReadResponse,
	SMSResponse,
	SMSSendDirectParams,
	SMSSendDirectResponse,
	SMSSendParams,
	SMSSendResponse,
	SMSStartOTPListenerParams,
	SMSStartOTPListenerResponse,
} from "./types";

const NOT_NATIVE_ERROR = "This function will work in Native App Powered By WebToNative";

/** Resolver of the running `startOTPListener` call, so a restart can cancel it. */
let pendingOtpResolve: ((response: SMSStartOTPListenerResponse) => void) | null = null;

/**
 * Registers a one-shot listener for `action`, triggers the native call and resolves with the response.
 * Android: `params` is sent as one JSON string; when omitted the method is called with no argument
 * (an extra argument fails with "method not found").
 * iOS: `params` is spread into the postMessage payload.
 * Android builds without the SMS addon reply `{ success: false, error: "feature_unavailable" }`;
 * that is resolved as `status: "NOT_ENABLED"`.
 */
const callSMS = <T extends SMSResponse>(action: string, params?: object): Promise<T> => {
	return new Promise((resolve, reject) => {
		if (!["ANDROID_APP", "IOS_APP"].includes(platform)) {
			reject(NOT_NATIVE_ERROR);
			return;
		}

		registerCb(
			(response: T) => {
				if (response.type === action) {
					if (response.success === false && response.error === "feature_unavailable") {
						response.status = "NOT_ENABLED";
					}
					resolve(response);
				}
			},
			{ key: action }
		);

		if (platform === "ANDROID_APP") {
			if (!webToNative[action]) {
				reject(`${action} is not supported in this app version`);
				return;
			}
			params ? webToNative[action](JSON.stringify(params)) : webToNative[action]();
		} else if (webToNativeIos) {
			webToNativeIos.postMessage({ action, ...(params || {}) });
		}
	});
};

/**
 * Reports what this build, platform and device can do. Call it first and hide UI you can't use.
 * @example
 * wtn.SMS.getCapabilities().then((res) => console.log(res.composer, res.otpListener, res.read, res.sendDirect));
 */
export const getCapabilities = (): Promise<SMSCapabilitiesResponse> => {
	return callSMS<SMSCapabilitiesResponse>("smsGetCapabilities");
};

/**
 * Opens the message composer with the recipients and text filled in. The user sends it.
 * Status: OPENED (Android) | SENT | CANCELLED | UNAVAILABLE (iOS) | FAILED | NOT_ENABLED.
 * @example
 * wtn.SMS.send({ recipients: ["+919876543210"], body: "Hi" }).then((res) => console.log(res.status));
 */
export const send = (params: SMSSendParams): Promise<SMSSendResponse> => {
	return callSMS<SMSSendResponse>("smsSend", params);
};

/**
 * Waits for the next OTP SMS and resolves with the code (Android; iOS resolves UNSUPPORTED —
 * use `<input autocomplete="one-time-code">` there).
 * Start it **before** your backend sends the SMS. Calling it again (resend OTP) re-arms the
 * listener and resolves the earlier call with `status: "CANCELLED"`.
 * Status: RECEIVED | TIMEOUT | DENIED | CANCELLED | FAILED | NOT_ENABLED | UNSUPPORTED.
 * @example
 * const pending = wtn.SMS.startOTPListener({ mode: "consent", length: 6 });
 * await fetch("/api/send-otp", { method: "POST", body: phone });
 * pending.then((res) => res.status === "RECEIVED" && verifyOtp(res.otp));
 */
export const startOTPListener = (
	params: SMSStartOTPListenerParams = {}
): Promise<SMSStartOTPListenerResponse> => {
	if (pendingOtpResolve) {
		pendingOtpResolve({ type: "smsStartOTPListener", status: "CANCELLED", otp: null });
	}
	return new Promise<SMSStartOTPListenerResponse>((resolve, reject) => {
		const done = (response: SMSStartOTPListenerResponse) => {
			if (pendingOtpResolve === done) pendingOtpResolve = null;
			resolve(response);
		};
		pendingOtpResolve = done;
		callSMS<SMSStartOTPListenerResponse>("smsStartOTPListener", params).then(done, (err) => {
			if (pendingOtpResolve === done) pendingOtpResolve = null;
			reject(err);
		});
	});
};

/**
 * Stops the OTP listener and drops any held code. Call it once the code is verified.
 * Native sends no reply of its own, so this resolves right away; a running
 * `startOTPListener` call resolves with `status: "CANCELLED"`. No-op on iOS.
 * @example
 * wtn.SMS.stopOTPListener();
 */
export const stopOTPListener = (): Promise<void> => {
	return new Promise((resolve, reject) => {
		if (!["ANDROID_APP", "IOS_APP"].includes(platform)) {
			reject(NOT_NATIVE_ERROR);
			return;
		}
		if (platform === "ANDROID_APP") {
			if (!webToNative.smsStopOTPListener) {
				reject("smsStopOTPListener is not supported in this app version");
				return;
			}
			webToNative.smsStopOTPListener();
		} else if (webToNativeIos) {
			webToNativeIos.postMessage({ action: "smsStopOTPListener" });
		}
		resolve();
	});
};

/**
 * Reads received SMS, newest first (Android only, needs the Read SMS toggle and the "sms" permission).
 * Status: SUCCESS | FAILED | PERMISSION_DENIED | NOT_ENABLED | UNSUPPORTED.
 * @example
 * wtn.SMS.read({ sender: "HDFCBK", since: Date.now() - 86400000, limit: 5 })
 *   .then((res) => console.log(res.messages));
 */
export const read = (params: SMSReadParams = {}): Promise<SMSReadResponse> => {
	return callSMS<SMSReadResponse>("smsRead", params);
};

/**
 * Sends an SMS from the default SIM with no UI (Android only, needs the Direct send toggle
 * and the "sms" permission). DISPATCHED is not a delivery confirmation.
 * Status: DISPATCHED | FAILED | PERMISSION_DENIED | NOT_ENABLED | UNSUPPORTED.
 * @example
 * wtn.SMS.sendDirect({ recipient: "+919876543210", body: "Hi" }).then((res) => console.log(res.status));
 */
export const sendDirect = (params: SMSSendDirectParams): Promise<SMSSendDirectResponse> => {
	return callSMS<SMSSendDirectResponse>("smsSendDirect", params);
};
