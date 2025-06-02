import { platform, webToNative, webToNativeIos, registerCb } from "../utills";

export const makePayment = (options) => {
    if (["ANDROID_APP","IOS_APP"].includes(platform)) {
        const { callback, apiUrl, amount, currency, isSimulated=false, captureMethod="automatic" } = options;
        registerCb((response) => {
            const { type } = response;
            if (type === "makeTapToPayStripePayment") {
                callback && callback(response);
            }
        });
        
        platform === "ANDROID_APP" && webToNative.makeTapToPayStripePayment(JSON.stringify({
            apiUrl,
            amount,
            currency,
            isSimulated,
            captureMethod
        }));

        platform === "IOS_APP" && webToNativeIos.postMessage({
            "action": "makeTapToPayStripePayment",
            apiUrl,
            amount,
            currency,
            isSimulated,
            captureMethod
        });
    }
};