import * as webToNative from './src/index';
import * as OneSignal from './src/OneSignal'
import VoiceSearch from './src/VoiceSearch'
import * as Barcode from './src/barcode'
import * as AdMob from './src/AdMob'
window.WTN = webToNative;

window.WTN.OneSignal = OneSignal
window.WTN.VoiceSearch = VoiceSearch
window.WTN.Barcode = Barcode
window.WTN.AdMob = AdMob

if(window && window.WebToNativeInterface && window.WebToNativeInterface.getAndroidVersion){
    window.navigator.share = function(obj){
        return new Promise((resolve, reject) => {
            window.WebToNativeInterface.openShareIntent(obj.url);
            resolve();
        })
    }
}