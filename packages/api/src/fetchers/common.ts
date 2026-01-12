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
