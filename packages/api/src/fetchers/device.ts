import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import {
  TGetDeviceDetailResponse,
  IPostDeviceDetailRequest,
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
