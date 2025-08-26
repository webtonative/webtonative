import {
    platform,
    webToNative,
    webToNativeIos,
  } from "../utills";
import { AppsFlyerEventValues, AppsFlyerIosMessage } from "./types";

/**
 * Sets the AppsFlyer customer user ID
 * @param userId - The user ID to set
 * @example wtn.appsflyer.setCustomerUserId("1234");
 */
export const setCustomerUserId = (userId: string): void => {
  if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
    platform === "ANDROID_APP" &&
      webToNative.setAppsFlyerUserId(userId);

    if (platform === "IOS_APP" && webToNativeIos) {
      webToNativeIos.postMessage({
        action: "setAppsFlyerUserId",
        userId
      } as AppsFlyerIosMessage);
    }
  }
};

/**
 * Logs an event to AppsFlyer
 * @param eventName - The name of the event
 * @param eventValues - The values associated with the event
 * @example wtn.appsflyer.logEvent("ADD_TO_CART",{name:"Cadburry",quantity:1});
 */
export const logEvent = (eventName: string, eventValues: AppsFlyerEventValues): void => {
  if (["ANDROID_APP", "IOS_APP"].includes(platform)) {
    platform === "ANDROID_APP" &&
      webToNative.addEventToAppsFlyer(eventName, JSON.stringify(eventValues));

    if (platform === "IOS_APP" && webToNativeIos) {
      webToNativeIos.postMessage({
        action: "addEventToAppsFlyer",
        eventName,
        eventValues
      } as AppsFlyerIosMessage);
    }
  }
};