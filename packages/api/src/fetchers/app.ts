import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type { TAppType, TGetLatestAppVersionResponse } from '../types/app';

export const getLatestAppVersion = async (
  appType: TAppType
): Promise<TGetLatestAppVersionResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetLatestAppVersionResponse>({
    method: 'GET',
    url: ENDPOINTS.APP.LATEST_VERSION(appType),
  });

  return response.data;
};
