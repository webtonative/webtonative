import { platform, webToNative, webToNativeIos, registerCb } from "../utills";
import {
	StripeOptions,
	StripePaymentData,
	StripeIosMessage,
	TapToPaySetupAction,
	TapToPaySetupCallback,
	TapToPaySetupIosMessage,
	TapToPaySetupOptions,
	PrepareTapToPaySetupOptions,
} from "./types";

export const makeTapToPay = (options: StripeOptions): void => {
	if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
		const {
			callback,
			apiUrl = null,
			amount,
			currency,
			isSimulated = false,
			captureMethod = "automatic",
			connectionToken,
			stripeLocationId,
			clientSecret = null,
			connectedAccountId = "",
		} = options;

		registerCb(
			(response) => {
				const { type } = response;
				if (type === "makeTapToPayStripePayment") {
					callback && callback(response);
				}
			},
			{ key: "makeTapToPayStripePayment" }
		);

		let paymentData: StripePaymentData = {
			secretToken: connectionToken,
			amount,
			currency,
			isSimulated,
			captureMethod,
			locationId: stripeLocationId,
		};

		if (apiUrl) {
			paymentData.apiUrl = apiUrl;
		}

		if (clientSecret) {
			paymentData.client_secret = clientSecret;
		}

		if (platform === "ANDROID_APP") {
			webToNative.makeTapToPayStripePayment(JSON.stringify(paymentData));
		}

		if (platform === "IOS_APP" && webToNativeIos) {
			const iosMessage: StripeIosMessage = {
				action: "makeTapToPayStripePayment",
				...paymentData,
				connectedAccountId,
			};
			webToNativeIos.postMessage(iosMessage);
		}
	}
};

const postTapToPaySetupMessage = (
	message: TapToPaySetupIosMessage,
	callback?: TapToPaySetupCallback
): void => {
	if (platform === "IOS_APP" && webToNativeIos) {
		const action: TapToPaySetupAction = message.action;

		registerCb(
			(response) => {
				const { type } = response;
				if (type === action) {
					callback && callback(response);
				}
			},
			{ key: action }
		);

		webToNativeIos.postMessage(message);
	}
};

/**
 * Inspects the device's Tap to Pay on iPhone setup (iOS only)
 * @param options - Options including callback
 * @example wtn.Stripe.inspectTapToPaySetup({
 *  callback: (data) => {
 *    console.log(data);
 *  }
 * });
 */
export const inspectTapToPaySetup = (options: TapToPaySetupOptions = {}): void => {
	const { callback } = options;
	postTapToPaySetupMessage({ action: "inspectTapToPaySetup" }, callback);
};

/**
 * Presents Apple's Tap to Pay on iPhone education screens (iOS only)
 * @param options - Options including callback
 * @example wtn.Stripe.presentTapToPayEducation({
 *  callback: (data) => {
 *    console.log(data);
 *  }
 * });
 */
export const presentTapToPayEducation = (options: TapToPaySetupOptions = {}): void => {
	const { callback } = options;
	postTapToPaySetupMessage({ action: "presentTapToPayEducation" }, callback);
};

/**
 * Prepares Tap to Pay on iPhone for the given Stripe location (iOS only)
 * @param options - Options including connectionToken, stripeLocationId, connectedAccountId and callback
 * @example wtn.Stripe.prepareTapToPaySetup({
 *  connectionToken: "YOUR_STRIPE_TERMINAL_CONNECTION_TOKEN",
 *  stripeLocationId: "tml_xxxxxxxxxxxx",
 *  connectedAccountId: "",
 *  callback: (data) => {
 *    console.log(data);
 *  }
 * });
 */
export const prepareTapToPaySetup = (options: PrepareTapToPaySetupOptions): void => {
	const { callback, connectionToken, stripeLocationId, connectedAccountId = "" } = options;
	postTapToPaySetupMessage(
		{
			action: "prepareTapToPaySetup",
			locationId: stripeLocationId,
			secretToken: connectionToken,
			connectedAccountId,
		},
		callback
	);
};
