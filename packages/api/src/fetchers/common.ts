import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import {
  IApiResponse,
  IAppVersionResponse,
  TAppVersionType,
} from '../types/common';

export const getHolidays = async () => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<IApiResponse<boolean>>({
    method: 'GET',
    url: ENDPOINTS.COMMON.HOLIDAYS,
  });

  return response.data;
};

export const getLatestVersion = async (type: TAppVersionType) => {
  const axiosInstance = getAxiosInstance('private');

  const response = await axiosInstance<IApiResponse<IAppVersionResponse>>({
    method: 'GET',
    url: ENDPOINTS.COMMON.APP_LATEST_VERSION(type),
  });

  return response.data;
};
