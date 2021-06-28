import webToNative from './src/index';
import OneSignal from './src/OneSignal'
import VoiceSearch from './src/VoiceSearch'
import Barcode from './src/barcode'
window.WTN = webToNative;

window.WTN.OneSignal = OneSignal
window.WTN.VoiceSearch = VoiceSearch
window.WTN.Barcode = Barcode