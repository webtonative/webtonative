import { BaseResponse } from "../types";

export interface BarcodeScanResponse extends BaseResponse {
  type: "BARCODE_SCAN";
  value: string;
}

export type BarcodeScanCallback = (value: string) => void;

export interface BarcodeScanOptions {
  onBarcodeSearch?: BarcodeScanCallback;
  format?: number;
}

export interface BarcodeScanAndroidParams {
  formats: number[];
}

export interface BarcodeScanIosMessage {
  action: string;
  barcodeFormat: string;
}