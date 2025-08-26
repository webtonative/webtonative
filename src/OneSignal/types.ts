// Define types for OneSignal module

// Response from getPlayerId
export interface PlayerIdResponse {
  isSuccess: boolean;
  playerId?: string;
  [key: string]: any;
}

// Message structure for iOS
export interface OneSignalIosMessage {
  action: string;
  userId?: string;
  [key: string]: any;
}