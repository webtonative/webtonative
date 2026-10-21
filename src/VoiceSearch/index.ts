import { webToNative, isNativeApp, registerCb } from "../utills";
import { VoiceSearchOptions, VoiceSearchCallback, VoiceSearchResponse } from "./types";

let voiceSearchCb: VoiceSearchCallback | null = null;

/**
 * This function opens native voice search
 * @param options Configuration options for voice search
 * @example wtn.openVoiceSearch({
 *  onVoiceSearch:(value)=>{
 *    console.log(value);
 *  }
 * });
 */
const openVoiceSearch = (options: VoiceSearchOptions = {}): any => {
  const { onVoiceSearch } = options;
  
  registerCb((response) => {
    const { type, results } = response as VoiceSearchResponse;
    if (type === "VOICE_SEARCH_RESULT") {
      voiceSearchCb && voiceSearchCb(results);
      voiceSearchCb = null;
    }
  });
  
  if (isNativeApp) {
    webToNative.openVoiceSearch();
  }
  
  if (typeof onVoiceSearch === "function") {
    voiceSearchCb = onVoiceSearch;
  }
  
  return this;
};

export default openVoiceSearch;