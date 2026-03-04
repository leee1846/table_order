import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import { IApiResponse } from '../types/common';

export const getHolidays = async () => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<IApiResponse<boolean>>({
    method: 'GET',
    url: ENDPOINTS.COMMON.HOLIDAYS,
  });

  return response.data;
};

export const getPosSyncStatus = async (
  shopCode: string,
  ignoreGlobalErrors?: number[]
) => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<IApiResponse<null>>({
    method: 'GET',
    url: ENDPOINTS.COMMON.POS_SYNC_STATUS(shopCode),
    ignoreGlobalErrors,
  });

  return response.data;
};
