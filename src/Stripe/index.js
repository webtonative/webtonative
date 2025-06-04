import { platform, webToNative, webToNativeIos, registerCb } from "../utills";

export const makeTapToPay = (options) => {
    if (["ANDROID_APP","IOS_APP"].includes(platform)) {
        const { callback, apiUrl=null, amount, currency, isSimulated=false, captureMethod="automatic", connectionToken, stripeLocationId, clientSecret=null } = options;
        registerCb((response) => {
            const { type } = response;
            if (type === "makeTapToPayStripePayment") {
                callback && callback(response);
            }
        });

        let paymentData = {
            secretToken:connectionToken,
            amount,
            currency,
            isSimulated,
            captureMethod,
            locationId:stripeLocationId
        }
        if(apiUrl){
            paymentData.apiUrl = apiUrl
        }
        if(clientSecret){
            paymentData.client_secret = clientSecret
        }
        
        platform === "ANDROID_APP" && webToNative.makeTapToPayStripePayment(JSON.stringify(paymentData));

        platform === "IOS_APP" && webToNativeIos.postMessage({
            "action": "makeTapToPayStripePayment",
            ...paymentData
        });
    }
};