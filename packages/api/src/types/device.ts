import { IApiResponse, TVoidApiResponse } from './common';

export type TDeviceType = 'POS_APP' | 'ORDER_POS' | 'MENU';

export interface IDeviceBase {
  androidId: string;
  deviceType: TDeviceType;
  orderPosNumber: number | null;
  tableNumber: string | null;
  battery: number | null;
  wifiSignal: string | null;
  ipAddress: string;
  version: string;
  buildNumber: string;
  tableName: string | null;
}

export interface IDevice extends IDeviceBase {
  deviceSeq: number;
  shopSeq: number;
}

export type TGetDeviceDetailResponse = IApiResponse<IDevice>;

export interface IPostDeviceDetailRequest extends IDeviceBase {
  shopCode: string;
}

export interface IGetDeviceListItem extends IDevice {
  updateDate: string;
}

export type TGetDeviceListResponse = IApiResponse<IGetDeviceListItem[]>;

export interface IGetDeviceListWithPaginationParams {
  shopCode: string;
  /**
   * 0부터 시작
   */
  pageNumber?: number;
  pageSize?: number;
}

export interface IDeviceListWithPagination {
  currentPageNumber: number;
  totalPageNumber: number;
  deviceList: IGetDeviceListItem[];
}

export type TGetDeviceListWithPaginationResponse =
  IApiResponse<IDeviceListWithPagination>;

export type TDeviceControlType =
  | 'DEVICE_OFF'
  | 'DEVICE_RESTART'
  | 'DEVICE_APP_UPDATE'
  | 'DEVICE_SCREEN_OFF'
  | 'DEVICE_SCREEN_ON';

export interface IDeviceControlItem {
  androidId: string;
}

export interface IPostDeviceControlRequest {
  shopCode: string;
  deviceControlType: TDeviceControlType;
  deviceList: IDeviceControlItem[];
}

export type TPostDeviceControlResponse = TVoidApiResponse;
