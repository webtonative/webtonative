// Define types for Screen module

// iOS message structure
export interface ScreenIosMessage {
  action: string;
  flag?: boolean;
  [key: string]: any;
}