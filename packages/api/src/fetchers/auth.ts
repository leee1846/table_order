import { getRefreshToken } from '../auth/util';
import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  ILoginRequest,
  TLoginResponse,
  TRefreshAccessTokenResponse,
  ILoginMenuboardAdminRequest,
  TLoginMenuboardAdminResponse,
  ILoginSalesRequest,
} from '../types/auth';
import type { TVoidApiResponse } from '../types/common';

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
    skipGlobalErrorHandling: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getRefreshToken()}`,
    },
  });

  return response.data;
};

export const loginMenuboardAdmin = async ({
  shopCode,
  pw,
  ignoreGlobalErrors,
}: ILoginMenuboardAdminRequest & { ignoreGlobalErrors: number[] }) => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TLoginMenuboardAdminResponse>({
    method: 'POST',
    url: ENDPOINTS.AUTH.LOGIN_MENUBOARD_ADMIN,
    params: { shopCode, pw },
    ignoreGlobalErrors,
  });

  return response.data;
};

export const loginSales = async ({
  shopCode,
  pw,
  ignoreGlobalErrors,
}: ILoginSalesRequest & { ignoreGlobalErrors: number[] }) => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.AUTH.LOGIN_SALES,
    params: { shopCode, pw },
    ignoreGlobalErrors,
  });

  return response.data;
};

export const loginQr = async ({ token }: { token: string }) => {
  const axiosInstance = getAxiosInstance('public');
  const response = await axiosInstance<TLoginResponse>({
    method: 'POST',
    url: ENDPOINTS.AUTH.LOGIN_QR,
    params: { token },
  });

  return response.data;
};
