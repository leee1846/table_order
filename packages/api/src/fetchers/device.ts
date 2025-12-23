import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import {
  TGetDeviceDetailResponse,
  IPostDeviceDetailRequest,
  TGetDeviceListResponse,
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
  });

  return response.data;
};

export const getDeviceList = async (
  shopCode: string,
  ignoreGlobalErrors?: number[]
): Promise<TGetDeviceListResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetDeviceListResponse>({
    method: 'GET',
    url: ENDPOINTS.DEVICE.LIST(shopCode),
    ignoreGlobalErrors,
  });

  return response.data;
};
