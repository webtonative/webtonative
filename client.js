import * as webToNative from './src/index';
import * as OneSignal from './src/OneSignal'
import VoiceSearch from './src/VoiceSearch'
import * as Barcode from './src/barcode'
import * as AdMob from './src/AdMob'
import { socialLogin } from './src/SocialLogin/index'
import * as AppsFlyer from './src/AppsFlyer'
import inAppPurchase from './src/InAppPurchase'
window.WTN = webToNative;

window.WTN.OneSignal = OneSignal
window.WTN.VoiceSearch = VoiceSearch
window.WTN.Barcode = Barcode
window.WTN.AdMob = AdMob
window.WTN.socialLogin = socialLogin
window.WTN.inAppPurchase = inAppPurchase
window.WTN.appsflyer = AppsFlyer

if(window && window.WebToNativeInterface && window.WebToNativeInterface.getAndroidVersion){
    window.navigator.share = function(obj){
        return new Promise((resolve, reject) => {
            window.WebToNativeInterface.openShareIntent(obj.url);
            resolve();
        })
    }
}