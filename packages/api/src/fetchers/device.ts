import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import {
  TGetDeviceDetailResponse,
  IPostDeviceDetailRequest,
  TGetDeviceListResponse,
  IGetDeviceListWithPaginationParams,
  TGetDeviceListWithPaginationResponse,
  IPostDeviceControlRequest,
  TPostDeviceControlResponse,
  TGetTableOccupiedCheckResponse,
} from '../types/device';
import { TVoidApiResponse } from '../types/common';

export const getDeviceDetail = async (
  shopCode: string,
  androidId: string,
  ignoreGlobalErrors?: number[]
): Promise<TGetDeviceDetailResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetDeviceDetailResponse>({
    method: 'GET',
    url: ENDPOINTS.DEVICE.SHOP(shopCode),
    params: {
      androidId,
    },
    ignoreGlobalErrors,
    skipGlobalErrorHandling: true,
  });

  return response.data;
};

export const postDeviceDetail = async (
  requests: IPostDeviceDetailRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');

  const { shopCode, ...rest } = requests;
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.DEVICE.SHOP(shopCode),
    data: rest,
    skipGlobalErrorHandling: true,
  });

  return response.data;
};

export const getDeviceList = async (
  shopCode: string
): Promise<TGetDeviceListResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetDeviceListResponse>({
    method: 'GET',
    url: ENDPOINTS.DEVICE.LIST(shopCode),
  });

  return response.data;
};

export const getDeviceListWithPagination = async (
  params: IGetDeviceListWithPaginationParams
): Promise<TGetDeviceListWithPaginationResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetDeviceListWithPaginationResponse>({
    method: 'GET',
    url: ENDPOINTS.DEVICE.LIST_PAGE(params.shopCode),
    params: {
      pageNumber: params.pageNumber ?? 0,
      pageSize: params.pageSize ?? 10,
    },
  });

  return response.data;
};

export const postDeviceControl = async (
  params: IPostDeviceControlRequest
): Promise<TPostDeviceControlResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TPostDeviceControlResponse>({
    method: 'POST',
    url: ENDPOINTS.DEVICE.CONTROL(params.shopCode, params.deviceControlType),
    data: params.deviceList,
  });

  return response.data;
};

export const getTableOccupiedCheck = async (
  shopCode: string,
  tableNumber: string
): Promise<TGetTableOccupiedCheckResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetTableOccupiedCheckResponse>({
    method: 'GET',
    url: ENDPOINTS.DEVICE.TABLE_OCCUPIED_CHECK(shopCode, tableNumber),
    skipGlobalErrorHandling: true,
  });

  return response.data;
};
