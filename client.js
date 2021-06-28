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