import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import { TGetDeviceDetailResponse } from '../types/device';

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
