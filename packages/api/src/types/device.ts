import { IApiResponse } from './common';

export interface IDevice {
  deviceSeq: number;
  androidId: string;
  shopSeq: number;
  deviceType: string;
  tableNumber: number;
  battery: number;
  wifiSignal: string;
  ipAddress: string;
  version: string;
  buildNumber: string;
  updateDate: string;
}

export type TGetDeviceDetailResponse = IApiResponse<IDevice>;
