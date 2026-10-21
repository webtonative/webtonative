import { platform, webToNative, webToNativeIos, registerCb } from "../utills";
import { StripeOptions, StripePaymentData, StripeIosMessage } from "./types";

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
            clientSecret = null 
        } = options;
        
        registerCb((response) => {
            const { type } = response;
            if (type === "makeTapToPayStripePayment") {
                callback && callback(response);
            }
        });

        let paymentData: StripePaymentData = {
            secretToken: connectionToken,
            amount,
            currency,
            isSimulated,
            captureMethod,
            locationId: stripeLocationId
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
                "action": "makeTapToPayStripePayment",
                ...paymentData
            };
            webToNativeIos.postMessage(iosMessage);
        }
    }
};