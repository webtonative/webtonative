import { BaseCallback, BaseResponse } from "../types";

export interface StripeResponse extends BaseResponse {
  type: "makeTapToPayStripePayment";
  // Additional response properties can be added here based on actual response structure
}

export interface StripeCallback extends BaseCallback {
  (response: StripeResponse): void;
}

export interface StripePaymentData {
  secretToken: string;
  amount: number;
  currency: string;
  isSimulated: boolean;
  captureMethod: string;
  locationId: string;
  apiUrl?: string;
  client_secret?: string;
}

export interface StripeOptions {
  callback?: StripeCallback;
  apiUrl?: string;
  amount: number;
  currency: string;
  isSimulated?: boolean;
  captureMethod?: string;
  connectionToken: string;
  stripeLocationId: string;
  clientSecret?: string;
}

export interface StripeIosMessage extends StripePaymentData {
  action: string;
}