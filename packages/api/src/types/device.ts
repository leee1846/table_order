import { IApiResponse } from './common';

export type TDeviceType = 'POS_APP' | 'ORDER_POS' | 'MENU';

export interface IDeviceBase {
  androidId: string;
  deviceType: TDeviceType;
  orderPosNumber: number | null;
  tableNumber: string | null;
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
