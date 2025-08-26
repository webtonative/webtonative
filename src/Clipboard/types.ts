// Define types for Clipboard module

// Clipboard response interface
export interface ClipboardResponse {
  type: string;
  content?: string;
  [key: string]: any;
}

// Clipboard callback function type
export type ClipboardCallback = (response: ClipboardResponse) => void;

// Get clipboard options
export interface GetClipboardOptions {
  callback?: ClipboardCallback;
  [key: string]: any;
}

// Set clipboard options
export interface SetClipboardOptions {
  data?: string;
  [key: string]: any;
}

// iOS message structure
export interface ClipboardIosMessage {
  action: string;
  text?: string;
  [key: string]: any;
}