import { BaseResponse } from "../types";

export interface VoiceSearchResponse extends BaseResponse {
  type: "VOICE_SEARCH_RESULT";
  results: string;
}

export type VoiceSearchCallback = (results: string) => void;

export interface VoiceSearchOptions {
  onVoiceSearch?: VoiceSearchCallback;
}