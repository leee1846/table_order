import { IApiResponse } from './common';

export type TDeviceType = 'POS_APP' | 'ORDER_POS' | 'MENU';

export interface IDeviceBase {
  androidId: string;
  deviceType: TDeviceType;
  orderPosNumber: number | null;
  tableNumber: number | null;
  battery: number;
  wifiSignal: string;
  ipAddress: string;
  version: string;
  buildNumber: string;
}

export interface IDevice extends IDeviceBase {
  deviceSeq: number;
  shopSeq: number;
}

export type TGetDeviceDetailResponse = IApiResponse<IDevice>;

export interface IPostDeviceDetailRequest extends IDeviceBase {
  shopCode: string;
}
