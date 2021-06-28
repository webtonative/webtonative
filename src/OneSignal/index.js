import { isNativeApp, platform, webToNative, registerCb } from "../utills";
const getPlayerId = () => {
  return isNativeApp && webToNative.getOneSignalId();
};
const setExternalUserId = (userId) => {
  if (userId) {
    return isNativeApp && webToNative.setExternalUserId(userId);
  }
  throw "userId is required";
};
const removeExternalUserId = () => {
  return isNativeApp && webToNative.removeExternalUserId();
};
export { getPlayerId, setExternalUserId, removeExternalUserId };
export default { getPlayerId, setExternalUserId, removeExternalUserId }