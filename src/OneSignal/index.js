import {
  isNativeApp,
  platform,
  webToNative,
  registerCb,
  webToNativeIos,
} from "../utills";
const getPlayerId = () => {
  return new Promise((resolve, reject) => {
    registerCb((results) => {
      if (results.isSuccess) {
        resolve(results.playerId);
      } else {
        reject(results);
      }
    },{
      key:"getPlayerId"
    });
    if (platform === "ANDROID_APP") {
      webToNative.getOneSignalId();
    } else if (platform === "IOS_APP") {
      webToNativeIos.postMessage({
        action: "getPlayerId",
      });
    } else {
      reject("This function will work in Native App Powered By WebToNative");
    }
  });
};
const setExternalUserId = (userId) => {
  if (userId) {
    if (platform === "ANDROID_APP") {
      return isNativeApp && webToNative.setExternalUserId(userId);
    } else if (platform === "IOS_APP") {
      webToNativeIos.postMessage({
        action: "setExternalUserId",
        userId: userId,
      });
    }
  }
  throw "userId is required";
};
const removeExternalUserId = () => {
  if (platform === "ANDROID_APP") {
    return isNativeApp && webToNative.removeExternalUserId();
  } else if (platform === "IOS_APP") {
    webToNativeIos.postMessage({
      action: "removeExternalUserId",
    });
  }
};

const setTags = ({tags}) => {
  if (platform === "ANDROID_APP") {
    return isNativeApp && webToNative.setUserTags();
  } else if (platform === "IOS_APP") {
    webToNativeIos.postMessage({
      action: "setUserTags",
      tags
    });
  }
}

export { getPlayerId, setExternalUserId, removeExternalUserId, setTags };
