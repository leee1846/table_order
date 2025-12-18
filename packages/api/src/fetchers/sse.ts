import { ENDPOINTS } from '../cores/endpoints';
import { getAxiosInstance } from '../cores/axios';
import { getAccessToken } from '../auth';

export const connectSse = (token?: string): EventSource => {
  const accessToken = token ?? getAccessToken();

  if (!accessToken) {
    throw new Error('No access token');
  }

  const axiosInstance = getAxiosInstance('private');
  const baseUrl = axiosInstance.defaults.baseURL || window.location.origin;
  console.log('baseUrl', baseUrl);
  const url = new URL(ENDPOINTS.SSE.CONNECT, baseUrl);

  url.searchParams.set('token', accessToken);

  return new EventSource(url.toString());
};
