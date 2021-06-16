import { webToNative, isNativeApp, registerCb } from "../utills";
let voiceSearchCb = null;
/**
 * This function opens native voice search
 * @param {object} options
 * @example wtn.openVoiceSearch({
 *  onVoiceSearch:(value)=>{
 *    console.log(value);
 *  }
 * });
 */
export default (options = {}) => {
  const { onVoiceSearch } = options;
  registerCb((response) => {
    const { type, results } = response;
    if (type === "VOICE_SEARCH_RESULT") {
      voiceSearchCb && voiceSearchCb(results);
      voiceSearchCb = null;
    }
  });
  isNativeApp && webToNative.openVoiceSearch();
  if (typeof onVoiceSearch === "function") {
    voiceSearchCb = onVoiceSearch;
  }
  return this;
};
