import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  ILoginRequest,
  TLoginResponse,
  TRefreshAccessTokenResponse,
} from '../types/auth';

interface ILoginParams {
  params: ILoginRequest;
}
export const login = async ({ params }: ILoginParams) => {
  const axiosInstance = getAxiosInstance('public');
  const response = await axiosInstance<TLoginResponse>({
    method: 'POST',
    url: ENDPOINTS.AUTH.LOGIN,
    data: params,
  });

  return response.data;
};

export const refreshAccessToken = async () => {
  const axiosInstance = getAxiosInstance('raw');
  const response = await axiosInstance<TRefreshAccessTokenResponse>({
    method: 'POST',
    url: ENDPOINTS.AUTH.TOKEN_REFRESH,
    ignoreGlobalErrors: [401],
  });

  return response.data;
};
