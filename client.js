import * as webToNative from "./src/index";
import * as OneSignal from "./src/OneSignal";
import VoiceSearch from "./src/VoiceSearch";
import * as Barcode from "./src/barcode";
import * as AdMob from "./src/AdMob";
import { socialLogin } from "./src/SocialLogin/index";
import * as AppsFlyer from "./src/AppsFlyer";
import inAppPurchase from "./src/InAppPurchase";
import * as FBEvents from "./src/Facebook/events";
import * as BottomNavigation from "./src/BottomNavigation";
import * as contacts from "./src/NativeContacts";
import * as backgroundLocation from "./src/BackgroundLocation";
import * as screen from "./src/Screen";
import * as clipboard from "./src/Clipboard";
import * as appReview from "./src/AppReview";
import * as ATTConsent from "./src/ATTConsent";
import * as FirebaseAnalytics from "./src/FirebaseAnalytics";
import { webToNativeIos } from "./src/utills";
window.WTN = webToNative;

window.WTN.OneSignal = OneSignal;
window.WTN.VoiceSearch = VoiceSearch;
window.WTN.Barcode = Barcode;
window.WTN.AdMob = AdMob;
window.WTN.socialLogin = socialLogin;
window.WTN.inAppPurchase = inAppPurchase;
window.WTN.appsflyer = AppsFlyer;
window.WTN.bottomNavigation = BottomNavigation;
window.WTN.contacts = contacts;
window.WTN.screen = screen;
window.WTN.backgroundLocation = backgroundLocation;
window.WTN.clipboard = clipboard;
window.WTN.appReview = appReview;
window.WTN.ATTConsent = ATTConsent;
window.WTN.facebook = {
	events: FBEvents,
};
window.WTN.firebaseAnalytics = FirebaseAnalytics;

if (window && window.WebToNativeInterface && window.WebToNativeInterface.getAndroidVersion) {
	window.navigator.share = function (obj) {
		return new Promise((resolve, reject) => {
			window.WebToNativeInterface.openShareIntent(obj.url);
			resolve();
		});
	};
} else if (WTN.isIosApp) {
	window.navigator.share = function (obj) {
		return new Promise((resolve, reject) => {
			webToNativeIos.postMessage({
				action: "share",
				url: obj.url,
			});
			resolve();
		});
	};
}
